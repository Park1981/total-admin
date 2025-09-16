import app from './app.js';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ 유니텍 관리시스템 서버 실행 중: http://localhost:${port}`);
  console.log(`📊 테스트 페이지: http://localhost:${port}`);
  console.log(`🔗 API 엔드포인트: http://localhost:${port}/api`);
});
