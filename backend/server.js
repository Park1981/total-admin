// backend/server.js
// - Render 호환: 0.0.0.0 바인딩
// - 가벼운 헬스체크 라우트(/healthz) 추가

import app from './app.js';

const port = process.env.PORT || 3001;
const host = '0.0.0.0'; // ✅ Render에서는 반드시 외부 바인딩

// 헬스체크 (Render → Settings → Health Check Path=/healthz 로 지정)
app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

// 선택: 루트에 아주 가벼운 응답(무거운 SSR 등 있으면 헬스는 꼭 /healthz로 분리)
app.get('/', (req, res, next) => {
  res.status(200).send('UNITECH portal is up');
});

app.listen(port, host, () => {
  console.log(`✅ Server ready: http://${host}:${port}`);
  console.log(`🔗 API: http://${host}:${port}/api`);
  console.log(`🩺 Health: http://${host}:${port}/healthz`);
});

// (선택) Render 재시작 시 깔끔 종료
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully…');
  process.exit(0);
});
