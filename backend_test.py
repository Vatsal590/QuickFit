#!/usr/bin/env python3
"""
Backend API Testing Suite for QuickFit Fitness Application
Tests all backend endpoints and database connectivity
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading backend URL: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"
print(f"🔗 Testing backend at: {API_BASE}")

class BackendTester:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []
        
    def log_result(self, test_name, success, message="", details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        }
        self.results.append(result)
        
        if success:
            self.passed += 1
            print(f"{status} {test_name}: {message}")
        else:
            self.failed += 1
            print(f"{status} {test_name}: {message}")
            if details:
                print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test basic API health check endpoint"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_result("Health Check", True, "API is responding correctly")
                else:
                    self.log_result("Health Check", False, "Unexpected response content", f"Got: {data}")
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("Health Check", False, "Connection failed", str(e))
    
    def test_status_post(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": "QuickFit_Mobile_App"
            }
            
            response = requests.post(
                f"{API_BASE}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['client_name'] == test_data['client_name']:
                        self.log_result("POST Status", True, "Status check created successfully")
                        return data['id']  # Return ID for potential cleanup
                    else:
                        self.log_result("POST Status", False, "Client name mismatch", f"Expected: {test_data['client_name']}, Got: {data.get('client_name')}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("POST Status", False, "Missing required fields", f"Missing: {missing}")
            else:
                self.log_result("POST Status", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("POST Status", False, "Connection failed", str(e))
        except json.JSONDecodeError as e:
            self.log_result("POST Status", False, "Invalid JSON response", str(e))
        
        return None
    
    def test_status_get(self):
        """Test GET /api/status endpoint"""
        try:
            response = requests.get(f"{API_BASE}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    self.log_result("GET Status", True, f"Retrieved {len(data)} status checks")
                    
                    # Validate structure of returned items
                    if data:
                        first_item = data[0]
                        required_fields = ['id', 'client_name', 'timestamp']
                        if all(field in first_item for field in required_fields):
                            self.log_result("GET Status Structure", True, "Status check structure is valid")
                        else:
                            missing = [f for f in required_fields if f not in first_item]
                            self.log_result("GET Status Structure", False, "Invalid structure", f"Missing: {missing}")
                    else:
                        self.log_result("GET Status Structure", True, "Empty list returned (valid)")
                        
                else:
                    self.log_result("GET Status", False, "Response is not a list", f"Got type: {type(data)}")
            else:
                self.log_result("GET Status", False, f"HTTP {response.status_code}", response.text)
                
        except requests.exceptions.RequestException as e:
            self.log_result("GET Status", False, "Connection failed", str(e))
        except json.JSONDecodeError as e:
            self.log_result("GET Status", False, "Invalid JSON response", str(e))
    
    def test_database_connectivity(self):
        """Test database connectivity by creating and retrieving a status check"""
        try:
            # Create a unique test entry
            test_client_name = f"DB_Test_{uuid.uuid4().hex[:8]}"
            
            # POST to create entry
            post_response = requests.post(
                f"{API_BASE}/status",
                json={"client_name": test_client_name},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if post_response.status_code != 200:
                self.log_result("Database Connectivity", False, "Failed to create test entry", post_response.text)
                return
            
            created_entry = post_response.json()
            created_id = created_entry.get('id')
            
            # GET to verify entry exists
            get_response = requests.get(f"{API_BASE}/status", timeout=10)
            
            if get_response.status_code != 200:
                self.log_result("Database Connectivity", False, "Failed to retrieve entries", get_response.text)
                return
            
            all_entries = get_response.json()
            
            # Check if our test entry exists
            found_entry = None
            for entry in all_entries:
                if entry.get('id') == created_id:
                    found_entry = entry
                    break
            
            if found_entry:
                if found_entry.get('client_name') == test_client_name:
                    self.log_result("Database Connectivity", True, "Database read/write operations working")
                else:
                    self.log_result("Database Connectivity", False, "Data integrity issue", f"Expected: {test_client_name}, Got: {found_entry.get('client_name')}")
            else:
                self.log_result("Database Connectivity", False, "Created entry not found in database")
                
        except Exception as e:
            self.log_result("Database Connectivity", False, "Database test failed", str(e))
    
    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            response = requests.options(f"{API_BASE}/", timeout=10)
            
            # Check for CORS headers
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin']:
                self.log_result("CORS Configuration", True, "CORS headers present")
            else:
                # Try a regular GET request to check CORS
                get_response = requests.get(f"{API_BASE}/", timeout=10)
                if 'Access-Control-Allow-Origin' in get_response.headers:
                    self.log_result("CORS Configuration", True, "CORS headers present on GET")
                else:
                    self.log_result("CORS Configuration", False, "CORS headers missing")
                    
        except requests.exceptions.RequestException as e:
            self.log_result("CORS Configuration", False, "CORS test failed", str(e))
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = requests.get(f"{API_BASE}/nonexistent", timeout=10)
            if response.status_code == 404:
                self.log_result("Error Handling - 404", True, "Properly returns 404 for invalid endpoints")
            else:
                self.log_result("Error Handling - 404", False, f"Expected 404, got {response.status_code}")
            
            # Test invalid POST data
            response = requests.post(
                f"{API_BASE}/status",
                json={"invalid_field": "test"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
                self.log_result("Error Handling - Invalid Data", True, "Properly handles invalid POST data")
            else:
                self.log_result("Error Handling - Invalid Data", False, f"Expected 400/422, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_result("Error Handling", False, "Error handling test failed", str(e))
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting QuickFit Backend API Tests")
        print("=" * 50)
        
        # Core functionality tests
        self.test_health_check()
        self.test_status_post()
        self.test_status_get()
        self.test_database_connectivity()
        
        # Configuration and error handling tests
        self.test_cors_headers()
        self.test_error_handling()
        
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"📈 Success Rate: {(self.passed/(self.passed+self.failed)*100):.1f}%")
        
        if self.failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['message']}")
                    if result['details']:
                        print(f"    Details: {result['details']}")
        
        return self.failed == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All backend tests passed! QuickFit API is ready for mobile deployment.")
    else:
        print(f"\n⚠️  {tester.failed} test(s) failed. Please review and fix issues before deployment.")
    
    sys.exit(0 if success else 1)