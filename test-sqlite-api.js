// Test registration
const testRegistration = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        phone: '1234567890',
        password: 'securepassword'
      })
    });
    
    const data = await response.json();
    console.log('Registration Response:', data);
    
    if (response.ok) {
      // Test login
      const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '1234567890',
          password: 'securepassword'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
      
      if (loginResponse.ok && loginData.token) {
        // Test creating a sample
        const sampleResponse = await fetch('http://localhost:3000/api/v1/samples', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({
            patientName: 'Jane Smith',
            pickupAddress: '123 Main St, City',
            scheduledDate: '2025-08-07T10:00:00Z',
            priority: 'HIGH',
            notes: 'Handle with care',
            agentId: loginData.agent.id
          })
        });
        
        const sampleData = await sampleResponse.json();
        console.log('Sample Creation Response:', sampleData);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testRegistration();
