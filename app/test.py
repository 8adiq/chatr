#!/usr/bin/env python3
"""
Simple API testing script using requests
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"  # Change to 5000 for Flask
API_BASE = f"{BASE_URL}/api"

def test_registration():
    """Test user registration"""
    print("🧪 Testing Registration...")
    
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{API_BASE}/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("✅ Registration successful!")
        return response.json().get('token')
    else:
        print("❌ Registration failed!")
        return None

def test_login():
    """Test user login"""
    print("\n🧪 Testing Login...")
    
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{API_BASE}/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✅ Login successful!")
        return response.json().get('token')
    else:
        print("❌ Login failed!")
        return None

def test_profile(token):
    """Test getting user profile"""
    print("\n🧪 Testing Profile...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{API_BASE}/profile", headers=headers)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✅ Profile retrieval successful!")
    else:
        print("❌ Profile retrieval failed!")

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n🧪 Testing Invalid Login...")
    
    data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{API_BASE}/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 401:
        print("✅ Invalid login correctly rejected!")
    else:
        print("❌ Invalid login test failed!")

def test_duplicate_registration():
    """Test registering with existing email"""
    print("\n🧪 Testing Duplicate Registration...")
    
    data = {
        "username": "testuser2",
        "email": "test@example.com",  # Same email as before
        "password": "password123"
    }
    
    response = requests.post(f"{API_BASE}/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 400:
        print("✅ Duplicate registration correctly rejected!")
    else:
        print("❌ Duplicate registration test failed!")

def main():
    """Run all tests"""
    print("🚀 Starting Backend API Tests")
    print(f"Testing against: {BASE_URL}")
    print("=" * 50)
    
    try:
        # Test registration
        token = test_registration()
        
        # Test login
        if not token:
            token = test_login()
        
        # Test profile (requires token)
        if token:
            test_profile(token)
        
        # Test error cases
        test_invalid_login()
        test_duplicate_registration()
        
        print("\n" + "=" * 50)
        print("🎉 All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to {BASE_URL}")
        print("Make sure your backend server is running!")
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    main()