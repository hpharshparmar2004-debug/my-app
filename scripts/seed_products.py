import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"

products_data = [
    # Medicines - Tablets & Capsules
    {"name": "Paracetamol 500mg", "description": "Pain relief and fever reducer tablets", "price": 25.00, "category": "Medicines", "stock": 500, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"},
    {"name": "Ibuprofen 400mg", "description": "Anti-inflammatory pain relief tablets", "price": 45.00, "category": "Medicines", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"},
    {"name": "Amoxicillin 500mg", "description": "Antibiotic for bacterial infections", "price": 120.00, "category": "Medicines", "stock": 200, "requires_prescription": True, "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500"},
    {"name": "Cetirizine 10mg", "description": "Allergy relief antihistamine tablets", "price": 35.00, "category": "Medicines", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500"},
    {"name": "Azithromycin 250mg", "description": "Broad-spectrum antibiotic", "price": 180.00, "category": "Medicines", "stock": 150, "requires_prescription": True, "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500"},
    {"name": "Omeprazole 20mg", "description": "Acid reflux and heartburn relief", "price": 60.00, "category": "Medicines", "stock": 250, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"},
    {"name": "Metformin 500mg", "description": "Type 2 diabetes management", "price": 85.00, "category": "Medicines", "stock": 300, "requires_prescription": True, "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"},
    {"name": "Atorvastatin 10mg", "description": "Cholesterol lowering medication", "price": 150.00, "category": "Medicines", "stock": 200, "requires_prescription": True, "image_url": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500"},
    {"name": "Aspirin 75mg", "description": "Blood thinner and pain relief", "price": 30.00, "category": "Medicines", "stock": 500, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"},
    {"name": "Cough Syrup 100ml", "description": "Relief from dry and wet cough", "price": 95.00, "category": "Medicines", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500"},
    
    # Vitamins & Supplements
    {"name": "Vitamin C 1000mg", "description": "Immune system booster tablets", "price": 280.00, "category": "Vitamins & Supplements", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "Vitamin D3 60000 IU", "description": "Bone health and immunity", "price": 150.00, "category": "Vitamins & Supplements", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1550572017-4781748380ae?w=500"},
    {"name": "Multivitamin Tablets", "description": "Complete daily nutrition supplement", "price": 320.00, "category": "Vitamins & Supplements", "stock": 450, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "Omega-3 Fish Oil", "description": "Heart health and brain function", "price": 450.00, "category": "Vitamins & Supplements", "stock": 200, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1550572017-4781748380ae?w=500"},
    {"name": "Calcium + Vitamin D", "description": "Strong bones and teeth", "price": 250.00, "category": "Vitamins & Supplements", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "Iron Supplement", "description": "Combat anemia and fatigue", "price": 180.00, "category": "Vitamins & Supplements", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1550572017-4781748380ae?w=500"},
    {"name": "Zinc 50mg", "description": "Immunity and wound healing", "price": 220.00, "category": "Vitamins & Supplements", "stock": 250, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "B-Complex Tablets", "description": "Energy and nerve health", "price": 190.00, "category": "Vitamins & Supplements", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1550572017-4781748380ae?w=500"},
    
    # Personal Care
    {"name": "Hand Sanitizer 500ml", "description": "99.9% germ protection alcohol-based", "price": 120.00, "category": "Personal Care", "stock": 600, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500"},
    {"name": "Face Masks (Pack of 50)", "description": "3-ply disposable surgical masks", "price": 250.00, "category": "Personal Care", "stock": 500, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=500"},
    {"name": "Antiseptic Cream", "description": "Wound healing and infection prevention", "price": 85.00, "category": "Personal Care", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"},
    {"name": "Band-Aid (Pack of 100)", "description": "Adhesive bandages for cuts and wounds", "price": 95.00, "category": "Personal Care", "stock": 450, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500"},
    {"name": "Cotton Balls 200g", "description": "Pure cotton for medical use", "price": 50.00, "category": "Personal Care", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1582046304372-48aa31726c6d?w=500"},
    {"name": "Antiseptic Solution 100ml", "description": "Disinfectant for wounds and skin", "price": 75.00, "category": "Personal Care", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"},
    {"name": "Medical Gloves (Box of 100)", "description": "Latex-free disposable gloves", "price": 450.00, "category": "Personal Care", "stock": 200, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500"},
    {"name": "Thermometer Digital", "description": "Fast and accurate temperature measurement", "price": 180.00, "category": "Personal Care", "stock": 250, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500"},
    
    # Medical Devices
    {"name": "Blood Pressure Monitor", "description": "Digital BP monitoring device", "price": 1500.00, "category": "Medical Devices", "stock": 100, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1615486511262-2e1d79e00a80?w=500"},
    {"name": "Glucometer Kit", "description": "Blood sugar testing device with strips", "price": 850.00, "category": "Medical Devices", "stock": 150, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500"},
    {"name": "Pulse Oximeter", "description": "Measure oxygen saturation and pulse", "price": 1200.00, "category": "Medical Devices", "stock": 200, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500"},
    {"name": "Nebulizer Machine", "description": "Respiratory therapy device", "price": 2500.00, "category": "Medical Devices", "stock": 80, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1615486511262-2e1d79e00a80?w=500"},
    {"name": "Heating Pad", "description": "Electric heating pad for pain relief", "price": 650.00, "category": "Medical Devices", "stock": 120, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500"},
    {"name": "Infrared Thermometer", "description": "Non-contact temperature scanner", "price": 1800.00, "category": "Medical Devices", "stock": 150, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500"},
    
    # Baby Care
    {"name": "Baby Diapers (Pack of 50)", "description": "Soft and absorbent baby diapers", "price": 599.00, "category": "Baby Care", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500"},
    {"name": "Baby Wipes (Pack of 80)", "description": "Gentle baby wipes with aloe vera", "price": 199.00, "category": "Baby Care", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1608301387427-14e8556d6a6f?w=500"},
    {"name": "Baby Lotion 200ml", "description": "Moisturizing lotion for baby skin", "price": 250.00, "category": "Baby Care", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"},
    {"name": "Baby Shampoo 200ml", "description": "Tear-free gentle shampoo", "price": 220.00, "category": "Baby Care", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1608301387427-14e8556d6a6f?w=500"},
    {"name": "Baby Powder 400g", "description": "Talc-free baby powder", "price": 180.00, "category": "Baby Care", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500"},
    {"name": "Feeding Bottle 250ml", "description": "BPA-free baby feeding bottle", "price": 299.00, "category": "Baby Care", "stock": 200, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"},
    
    # First Aid
    {"name": "First Aid Kit", "description": "Complete emergency medical kit", "price": 850.00, "category": "First Aid", "stock": 150, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500"},
    {"name": "Gauze Bandage Roll", "description": "Sterile gauze for wound dressing", "price": 45.00, "category": "First Aid", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1582046304372-48aa31726c6d?w=500"},
    {"name": "Adhesive Tape Medical", "description": "Surgical adhesive tape 2 inch", "price": 35.00, "category": "First Aid", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500"},
    {"name": "Hydrogen Peroxide 100ml", "description": "Wound cleaning antiseptic solution", "price": 55.00, "category": "First Aid", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"},
    {"name": "Ice Pack", "description": "Reusable cold compress for injuries", "price": 120.00, "category": "First Aid", "stock": 200, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500"},
    
    # Ayurvedic & Herbal
    {"name": "Chyawanprash 500g", "description": "Immunity booster herbal jam", "price": 320.00, "category": "Ayurvedic & Herbal", "stock": 250, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"},
    {"name": "Ashwagandha Capsules", "description": "Stress relief and energy booster", "price": 380.00, "category": "Ayurvedic & Herbal", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "Tulsi Drops", "description": "Holy basil for immunity", "price": 180.00, "category": "Ayurvedic & Herbal", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"},
    {"name": "Triphala Powder 100g", "description": "Digestive health and detox", "price": 220.00, "category": "Ayurvedic & Herbal", "stock": 280, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "Giloy Juice 500ml", "description": "Immunity and fever management", "price": 280.00, "category": "Ayurvedic & Herbal", "stock": 200, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"},
    
    # Skin Care
    {"name": "Sunscreen SPF 50", "description": "Broad spectrum sun protection", "price": 450.00, "category": "Skin Care", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500"},
    {"name": "Anti-Acne Cream", "description": "Treatment for acne and pimples", "price": 280.00, "category": "Skin Care", "stock": 250, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"},
    {"name": "Moisturizing Lotion", "description": "Hydrating body lotion", "price": 320.00, "category": "Skin Care", "stock": 350, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500"},
    {"name": "Anti-Aging Serum", "description": "Reduces wrinkles and fine lines", "price": 850.00, "category": "Skin Care", "stock": 150, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"},
    {"name": "Face Wash 100ml", "description": "Deep cleansing face wash", "price": 250.00, "category": "Skin Care", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500"},
    
    # Additional Products to reach 50+
    {"name": "Protein Powder 1kg", "description": "Whey protein for muscle building", "price": 1800.00, "category": "Vitamins & Supplements", "stock": 180, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500"},
    {"name": "Pain Relief Spray", "description": "Fast-acting muscle pain relief", "price": 180.00, "category": "Medicines", "stock": 250, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"},
    {"name": "Eye Drops 10ml", "description": "Relief from dry and irritated eyes", "price": 95.00, "category": "Medicines", "stock": 300, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500"},
    {"name": "Antacid Tablets", "description": "Quick relief from acidity", "price": 40.00, "category": "Medicines", "stock": 500, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"},
    {"name": "Throat Lozenges", "description": "Soothes sore throat", "price": 65.00, "category": "Medicines", "stock": 400, "requires_prescription": False, "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"},
]

async def seed_products():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Clear existing products
    await db.products.delete_many({})
    print("Cleared existing products")
    
    # Insert new products
    products = []
    for product_data in products_data:
        product = {
            "id": str(uuid.uuid4()),
            **product_data
        }
        products.append(product)
    
    await db.products.insert_many(products)
    print(f"Inserted {len(products)} products")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_products())
