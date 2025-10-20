import requests
import sys
import json
from datetime import datetime

class AshamedicalAPITester:
    def __init__(self, base_url="https://asha-medical.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.test_results = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    self.log_result(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_result(name, True, f"Status: {response.status_code}, No JSON response")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                    self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}: {error_data}")
                except:
                    self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.log_result(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "",
            200
        )
        return success

    def test_user_registration(self):
        """Test user registration"""
        test_user_data = {
            "name": "Test User",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "+919876543210",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        login_data = {
            "email": "test@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            return len(response) > 0
        return False

    def test_get_categories(self):
        """Test getting product categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )
        
        if success and 'categories' in response:
            print(f"   Found categories: {response['categories']}")
            return len(response['categories']) > 0
        return False

    def test_search_products(self):
        """Test product search"""
        success, response = self.run_test(
            "Search Products",
            "GET",
            "products?search=medicine",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Search returned {len(response)} products")
            return True
        return False

    def test_filter_products_by_category(self):
        """Test filtering products by category"""
        success, response = self.run_test(
            "Filter Products by Category",
            "GET",
            "products?category=Medicines",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Category filter returned {len(response)} products")
            return True
        return False

    def test_get_single_product(self):
        """Test getting a single product"""
        # First get all products to get a valid product ID
        success, products = self.run_test(
            "Get Products for Single Product Test",
            "GET",
            "products",
            200
        )
        
        if success and products and len(products) > 0:
            product_id = products[0]['id']
            success, response = self.run_test(
                "Get Single Product",
                "GET",
                f"products/{product_id}",
                200
            )
            return success
        return False

    def test_cart_operations(self):
        """Test cart operations"""
        # Get a product first
        success, products = self.run_test(
            "Get Products for Cart Test",
            "GET",
            "products",
            200
        )
        
        if not success or not products:
            return False
            
        product_id = products[0]['id']
        
        # Test getting empty cart
        success, _ = self.run_test(
            "Get Empty Cart",
            "GET",
            "cart",
            200
        )
        if not success:
            return False
        
        # Test adding to cart
        success, _ = self.run_test(
            "Add to Cart",
            "POST",
            "cart/add",
            200,
            data={"product_id": product_id, "quantity": 2}
        )
        if not success:
            return False
        
        # Test getting cart with items
        success, cart_response = self.run_test(
            "Get Cart with Items",
            "GET",
            "cart",
            200
        )
        if not success:
            return False
            
        # Test updating cart
        success, _ = self.run_test(
            "Update Cart Quantity",
            "PUT",
            "cart/update",
            200,
            data={"product_id": product_id, "quantity": 3}
        )
        if not success:
            return False
        
        # Test removing from cart
        success, _ = self.run_test(
            "Remove from Cart",
            "PUT",
            "cart/update",
            200,
            data={"product_id": product_id, "quantity": 0}
        )
        if not success:
            return False
            
        return True

    def test_order_operations(self):
        """Test order operations"""
        # First add something to cart
        success, products = self.run_test(
            "Get Products for Order Test",
            "GET",
            "products",
            200
        )
        
        if not success or not products:
            return False
            
        product_id = products[0]['id']
        
        # Add to cart
        success, _ = self.run_test(
            "Add to Cart for Order",
            "POST",
            "cart/add",
            200,
            data={"product_id": product_id, "quantity": 1}
        )
        if not success:
            return False
        
        # Create order
        order_data = {
            "payment_method": "COD",
            "delivery_address": "123 Test Street, Test City, Test State - 123456",
            "phone": "+919876543210"
        }
        
        success, order_response = self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=order_data
        )
        
        if not success:
            return False
            
        order_id = order_response.get('order_id')
        if not order_id:
            return False
        
        # Test getting all orders
        success, _ = self.run_test(
            "Get All Orders",
            "GET",
            "orders",
            200
        )
        if not success:
            return False
        
        # Test getting single order
        success, _ = self.run_test(
            "Get Single Order",
            "GET",
            f"orders/{order_id}",
            200
        )
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+919876543210",
            "message": "This is a test message from automated testing."
        }
        
        success, _ = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Asha Medical Store API Tests")
        print("=" * 50)
        
        # Test API health
        if not self.test_health_check():
            print("❌ API is not responding. Stopping tests.")
            return False
        
        # Test user registration
        if not self.test_user_registration():
            print("❌ User registration failed. Trying login instead.")
            if not self.test_user_login():
                print("❌ Both registration and login failed. Stopping authenticated tests.")
                return False
        
        # Test authenticated endpoints
        self.test_get_user_profile()
        
        # Test product endpoints
        self.test_get_products()
        self.test_get_categories()
        self.test_search_products()
        self.test_filter_products_by_category()
        self.test_get_single_product()
        
        # Test cart operations
        self.test_cart_operations()
        
        # Test order operations
        self.test_order_operations()
        
        # Test contact form
        self.test_contact_form()
        
        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        # Save detailed results
        with open('/app/test_reports/backend_test_results.json', 'w') as f:
            json.dump({
                'summary': {
                    'total_tests': self.tests_run,
                    'passed_tests': self.tests_passed,
                    'success_rate': (self.tests_passed/self.tests_run)*100
                },
                'detailed_results': self.test_results
            }, f, indent=2)
        
        return self.tests_passed == self.tests_run

def main():
    tester = AshamedicalAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())