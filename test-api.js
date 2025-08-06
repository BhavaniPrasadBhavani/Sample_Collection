#!/usr/bin/env node

// Simple API test script
const API_BASE_URL = 'http://localhost:3000/api/v1';

async function makeRequest(method, path, body = null, token = null) {
  const url = `${API_BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function testAPI() {
  console.log('🧪 Testing Sample Collection API...\n');

  // Test 1: Health check
  console.log('1. Testing health endpoint...');
  try {
    const healthResponse = await fetch('http://localhost:3000/health');
    const health = await healthResponse.json();
    console.log('✅ Health check:', health.message);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Register a new agent
  console.log('\n2. Testing agent registration...');
  const registerData = {
    name: 'Test Agent',
    phone: `test${Date.now()}`, // Unique phone number
    password: 'testpassword123'
  };

  const registerResult = await makeRequest('POST', '/auth/register', registerData);
  if (registerResult.status === 201) {
    console.log('✅ Agent registration successful');
  } else {
    console.log('❌ Agent registration failed:', registerResult.data);
    return;
  }

  // Test 3: Login
  console.log('\n3. Testing agent login...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    phone: registerData.phone,
    password: registerData.password
  });

  if (loginResult.status === 200 && loginResult.data.token) {
    console.log('✅ Login successful');
    const token = loginResult.data.token;
    const agentId = loginResult.data.agent.id;

    // Test 4: Create a sample
    console.log('\n4. Testing sample creation...');
    const sampleData = {
      patientName: 'Test Patient',
      pickupAddress: '123 Test Street',
      scheduledDate: '2025-08-07',
      priority: 'HIGH',
      notes: 'Test sample',
      agentId: agentId
    };

    const sampleResult = await makeRequest('POST', '/samples', sampleData, token);
    if (sampleResult.status === 201) {
      console.log('✅ Sample creation successful');
      
      // Test 5: Get samples for agent
      console.log('\n5. Testing get samples...');
      const getSamplesResult = await makeRequest('GET', `/samples/${agentId}`, null, token);
      if (getSamplesResult.status === 200) {
        console.log('✅ Get samples successful');
        console.log(`📊 Found ${getSamplesResult.data.samples.length} samples`);
      } else {
        console.log('❌ Get samples failed:', getSamplesResult.data);
      }

    } else {
      console.log('❌ Sample creation failed:', sampleResult.data);
    }

  } else {
    console.log('❌ Login failed:', loginResult.data);
  }

  console.log('\n🎉 API tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ or you can install node-fetch');
  console.log('💡 Run: npm install node-fetch@2 and update the script');
} else {
  testAPI().catch(console.error);
}
