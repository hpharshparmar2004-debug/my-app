from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()


# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    phone: str
    name: str
    password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: EmailStr
    phone: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    phone: str
    name: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    image_url: str
    category: str
    stock: int
    requires_prescription: bool = False

class CartItem(BaseModel):
    product_id: str
    quantity: int

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[CartItem]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = 1

class UpdateCartRequest(BaseModel):
    product_id: str
    quantity: int

class OrderProduct(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    products: List[OrderProduct]
    total_amount: float
    payment_method: str  # "UPI" or "COD"
    upi_id: Optional[str] = None
    delivery_address: str
    phone: str
    status: str = "Pending"  # Pending, Confirmed, Delivered
    prescription_data: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreateOrderRequest(BaseModel):
    payment_method: str
    upi_id: Optional[str] = None
    delivery_address: str
    phone: str
    prescription_data: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str
    message: str


# Health Check
@api_router.get("/")
async def root():
    return {"message": "Asha Medical Store API", "status": "running"}

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        name=user_data.name,
        password=hashed_password
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Generate token
    access_token = create_access_token({"sub": user.id})
    
    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "phone": user.phone,
            "name": user.name
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate token
    access_token = create_access_token({"sub": user['id']})
    
    return {
        "token": access_token,
        "user": {
            "id": user['id'],
            "email": user['email'],
            "phone": user['phone'],
            "name": user['name']
        }
    }

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user['id'],
        "email": current_user['email'],
        "phone": current_user['phone'],
        "name": current_user['name']
    }


# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    if search:
        query['name'] = {"$regex": search, "$options": "i"}
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return {"categories": categories}


# Cart Routes
@api_router.get("/cart")
async def get_cart(current_user: dict = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user['id']}, {"_id": 0})
    if not cart:
        return {"items": [], "total": 0}
    
    # Fetch product details for each cart item
    cart_items_with_details = []
    total = 0
    
    for item in cart['items']:
        product = await db.products.find_one({"id": item['product_id']}, {"_id": 0})
        if product:
            cart_items_with_details.append({
                "product": product,
                "quantity": item['quantity'],
                "subtotal": product['price'] * item['quantity']
            })
            total += product['price'] * item['quantity']
    
    return {"items": cart_items_with_details, "total": total}

@api_router.post("/cart/add")
async def add_to_cart(request: AddToCartRequest, current_user: dict = Depends(get_current_user)):
    # Check if product exists
    product = await db.products.find_one({"id": request.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create cart
    cart = await db.carts.find_one({"user_id": current_user['id']})
    
    if not cart:
        new_cart = Cart(
            user_id=current_user['id'],
            items=[CartItem(product_id=request.product_id, quantity=request.quantity)]
        )
        cart_dict = new_cart.model_dump()
        cart_dict['updated_at'] = cart_dict['updated_at'].isoformat()
        await db.carts.insert_one(cart_dict)
    else:
        # Check if product already in cart
        item_found = False
        for item in cart['items']:
            if item['product_id'] == request.product_id:
                item['quantity'] += request.quantity
                item_found = True
                break
        
        if not item_found:
            cart['items'].append({"product_id": request.product_id, "quantity": request.quantity})
        
        cart['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.carts.update_one(
            {"user_id": current_user['id']},
            {"$set": {"items": cart['items'], "updated_at": cart['updated_at']}}
        )
    
    return {"message": "Product added to cart"}

@api_router.put("/cart/update")
async def update_cart(request: UpdateCartRequest, current_user: dict = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user['id']})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    if request.quantity <= 0:
        # Remove item from cart
        cart['items'] = [item for item in cart['items'] if item['product_id'] != request.product_id]
    else:
        # Update quantity
        for item in cart['items']:
            if item['product_id'] == request.product_id:
                item['quantity'] = request.quantity
                break
    
    cart['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.carts.update_one(
        {"user_id": current_user['id']},
        {"$set": {"items": cart['items'], "updated_at": cart['updated_at']}}
    )
    
    return {"message": "Cart updated"}

@api_router.delete("/cart/clear")
async def clear_cart(current_user: dict = Depends(get_current_user)):
    await db.carts.delete_one({"user_id": current_user['id']})
    return {"message": "Cart cleared"}


# Order Routes
@api_router.post("/orders")
async def create_order(request: CreateOrderRequest, current_user: dict = Depends(get_current_user)):
    # Get user's cart
    cart = await db.carts.find_one({"user_id": current_user['id']})
    if not cart or not cart['items']:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total and prepare order products
    order_products = []
    total_amount = 0
    
    for item in cart['items']:
        product = await db.products.find_one({"id": item['product_id']}, {"_id": 0})
        if product:
            order_products.append(OrderProduct(
                product_id=product['id'],
                name=product['name'],
                price=product['price'],
                quantity=item['quantity']
            ))
            total_amount += product['price'] * item['quantity']
    
    # Create order
    order = Order(
        user_id=current_user['id'],
        products=order_products,
        total_amount=total_amount,
        payment_method=request.payment_method,
        upi_id=request.upi_id,
        delivery_address=request.delivery_address,
        phone=request.phone,
        prescription_data=request.prescription_data
    )
    
    order_dict = order.model_dump()
    order_dict['created_at'] = order_dict['created_at'].isoformat()
    
    await db.orders.insert_one(order_dict)
    
    # Clear cart
    await db.carts.delete_one({"user_id": current_user['id']})
    
    return {"message": "Order placed successfully", "order_id": order.id}

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: dict = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": current_user['id']}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for order in orders:
        if isinstance(order['created_at'], str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": current_user['id']}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if isinstance(order['created_at'], str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return order


# Contact Route
@api_router.post("/contact")
async def create_contact(request: ContactRequest):
    contact = ContactMessage(
        name=request.name,
        email=request.email,
        phone=request.phone,
        message=request.message
    )
    
    contact_dict = contact.model_dump()
    contact_dict['created_at'] = contact_dict['created_at'].isoformat()
    
    await db.contacts.insert_one(contact_dict)
    
    return {"message": "Message sent successfully"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
