import fetch from 'node-fetch';

async function testApiDirect() {
  console.log('🧪 API 직접 테스트...');

  const API_URL = 'https://total-admin.onrender.com/api/employees/login';

  const testCases = [
    { username: 'admin', password: 'admin123' },
    { username: 'jpark', password: 'jpark123' },
    { username: 'manager1', password: 'manager123' }
  ];

  for (const test of testCases) {
    console.log(`\n🔐 ${test.username} 로그인 테스트...`);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test)
      });

      const result = await response.json();
      console.log('응답 상태:', response.status);
      console.log('응답 내용:', result);

      if (response.ok) {
        console.log('✅ 로그인 성공!');
      } else {
        console.log('❌ 로그인 실패');
      }
    } catch (error) {
      console.error('🚨 네트워크 오류:', error.message);
    }
  }
}

testApiDirect();