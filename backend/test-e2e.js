const BASE = process.env.BASE_URL || "http://localhost:5000";

console.log('Testing E2E with BASE_URL:', BASE);

async function test() {
  try {
    console.log('Testing health endpoint...');
    const response = await fetch(`${BASE}/healthz`);
    const data = await response.json();
    console.log('Health check response:', data);
    
    if (data.ok) {
      console.log('✓ Server is healthy');
      
      // Test registration
      console.log('Testing registration...');
      const regResponse = await fetch(`${BASE}/api/auth/register`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ name: "Admin", email: "admin@example.com", password: "secret123", role: "ADMIN" })
      });
      
      if (regResponse.status === 201) {
        console.log("✓ Registered admin");
      } else if (regResponse.status === 409) {
        console.log("• Admin already exists");
      } else {
        const errorText = await regResponse.text();
        console.log("Registration failed:", regResponse.status, errorText);
      }
      
      // Test login
      console.log('Testing login...');
      const loginResponse = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email: "admin@example.com", password: "secret123" })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log("✓ Login successful, got token");
        
        // Test creating a plan
        console.log('Testing plan creation...');
        const planResponse = await fetch(`${BASE}/api/plans`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginData.accessToken}`
          },
          body: JSON.stringify({ name: "Test Plan", price: 25, durationDays: 30 })
        });
        
        if (planResponse.ok) {
          const planData = await planResponse.json();
          console.log("✓ Plan created:", planData.id);
        } else {
          const errorText = await planResponse.text();
          console.log("Plan creation failed:", planResponse.status, errorText);
        }
        
      } else {
        const errorText = await loginResponse.text();
        console.log("Login failed:", loginResponse.status, errorText);
      }
      
    } else {
      console.log('❌ Server health check failed');
    }
    
  } catch (error) {
    console.error('E2E test error:', error.message);
  }
}

test();


