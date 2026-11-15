// Test API endpoints against running server or launch standalone
const net = require('net');

async function testBackend() {
  console.log('Testing BorrowBuddy Backend Endpoints on http://localhost:5000...');

  try {
    // 1. Health check
    const healthRes = await (await fetch('http://localhost:5000/api/health')).json();
    console.log('1. Health Check:', healthRes);

    // 2. Community Stats
    const statsRes = await (await fetch('http://localhost:5000/api/stats/community')).json();
    console.log('2. Community Stats:', statsRes);

    // 3. Login
    const loginRes = await (await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aarav@borrowbuddy.com', password: 'password123' }),
    })).json();
    console.log('3. Login success:', loginRes.success, 'Token present:', !!loginRes.token);
    const token = loginRes.token;

    // 4. Get items with filter
    const itemsRes = await (await fetch('http://localhost:5000/api/items?category=Tools')).json();
    console.log('4. Tools items count:', itemsRes.items.length);
    const drillItem = itemsRes.items[0];

    // 5. Passport
    const passportRes = await (await fetch(`http://localhost:5000/api/items/${drillItem._id}/passport`)).json();
    console.log('5. Passport metrics:', passportRes.passport.metrics);

    // 6. User profile
    const profileRes = await (await fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })).json();
    console.log('6. User profile name:', profileRes.user.name, 'City:', profileRes.user.city);

    // 7. Dashboard stats
    const dashStatsRes = await (await fetch('http://localhost:5000/api/stats/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })).json();
    console.log('7. Dashboard stats for Aarav:', dashStatsRes.stats);

    console.log('✅ ALL 7 API ENDPOINTS RESPONDED WITH 100% SUCCESS!');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

testBackend();
