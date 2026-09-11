// Test authentication flow
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register a STUDENT
    console.log('1️⃣ Testing STUDENT registration...');
    const studentResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `student${Date.now()}@test.com`,
        password: 'password123',
        name: 'Test Student',
        role: 'STUDENT',
        institutionName: 'Test University',
        course: 'Computer Science',
        yearOfStudy: '2',
        bio: 'Test bio',
      }),
    });
    
    if (studentResponse.ok) {
      const studentData = await studentResponse.json();
      console.log('✅ STUDENT registered:', studentData.user.email);
    } else {
      const error = await studentResponse.json();
      console.log('❌ STUDENT registration failed:', error.error);
    }

    // Test 2: Register an INDUSTRY user
    console.log('\n2️⃣ Testing INDUSTRY registration...');
    const industryResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `company${Date.now()}@test.com`,
        password: 'password123',
        name: 'Test Company',
        role: 'INDUSTRY',
        companyName: 'Tech Corp',
        industryType: 'Technology',
        website: 'https://test.com',
        description: 'Test company',
      }),
    });
    
    if (industryResponse.ok) {
      const industryData = await industryResponse.json();
      console.log('✅ INDUSTRY registered:', industryData.user.email);
    } else {
      const error = await industryResponse.json();
      console.log('❌ INDUSTRY registration failed:', error.error);
    }

    // Test 3: Register an ACADEMICIAN
    console.log('\n3️⃣ Testing ACADEMICIAN registration...');
    const academicEmail = `academic${Date.now()}@test.com`;
    const academicResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: academicEmail,
        password: 'password123',
        name: 'Dr. Test Professor',
        role: 'ACADEMICIAN',
        institutionName: 'Test University',
        department: 'Computer Science',
        designation: 'Professor',
      }),
    });
    
    if (academicResponse.ok) {
      const academicData = await academicResponse.json();
      console.log('✅ ACADEMICIAN registered:', academicData.user.email);
      
      // Test 4: Login with the academician
      console.log('\n4️⃣ Testing login with ACADEMICIAN...');
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: academicEmail,
          password: 'password123',
        }),
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful:', loginData.user.role);
        
        // Get cookie from response
        const cookies = loginResponse.headers.get('set-cookie');
        console.log('✅ Auth cookie set:', cookies ? 'YES' : 'NO');
      } else {
        const error = await loginResponse.json();
        console.log('❌ Login failed:', error.error);
      }
    } else {
      const error = await academicResponse.json();
      console.log('❌ ACADEMICIAN registration failed:', error.error);
    }

    console.log('\n✅ All API tests completed!');
    console.log('\n📝 Manual testing required:');
    console.log('1. Visit http://localhost:3000/auth/register');
    console.log('2. Register users with different roles');
    console.log('3. Try logging in and accessing role-specific dashboards');
    console.log('4. Test unauthorized access (e.g., STUDENT trying to access /industry)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();
