// backend/server.js
// Render 런타임에서 단일 앱 인스턴스를 그대로 바인딩한다.

import app from './app.js';

const port = process.env.PORT || 3001;
const host = '0.0.0.0'; // Render에서는 외부 바인딩 필수

const server = app.listen(port, host, () => {
  console.log(`✅ Server ready: http://${host}:${port}`);
  console.log(`🔗 API: http://${host}:${port}/api`);
  console.log(`🩺 Health: http://${host}:${port}/healthz`);
});

// Render 재시작 시 깔끔 종료
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully…');
  server.close(() => process.exit(0));
});
