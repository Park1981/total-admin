# 🏭 유니텍 관리시스템

Supabase + Vercel + Render 기반의 현대적인 회사 관리 시스템

## ✨ 주요 기능

- 👥 **직원 관리**: 직원 정보 CRUD 
- 🔧 **제조장비 관리**: 장비 현황 및 유지보수
- 🛠️ **A/S 관리**: 고객 서비스 요청 처리
- 📊 **대시보드**: 실시간 현황 모니터링

## 🚀 기술 스택

### Backend
- **Node.js + Express.js**: RESTful API 서버
- **Supabase**: PostgreSQL 데이터베이스 + 인증
- **TypeScript**: 타입 안전성

### Frontend  
- **HTML/CSS/JavaScript**: 반응형 웹 UI
- **자동 타입 생성**: Supabase 스키마 동기화

### 배포
- **Vercel**: 프론트엔드 배포
- **Render**: 백엔드 API 배포
- **GitHub Actions**: CI/CD 자동화

## 📋 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/Park1981/total-admin.git
cd total-admin
npm install
```

### 2. 환경 설정
```bash
# .env 파일 생성 (예시 참고)
cp .env.example .env

# Supabase 프로젝트 연결
supabase login
supabase link --project-ref your-project-ref
```

### 3. 데이터베이스 설정
```bash
# 스키마 동기화 및 타입 생성
supabase db pull
npm run typegen

# 마이그레이션 적용 및 시드 데이터
npm run dbpush  
npm run seed
```

### 4. 개발 서버 실행
```bash
npm start
# 서버: http://localhost:3001
# 테스트 페이지: http://localhost:3001
```

## 🛠️ 개발 명령어

```bash
# 전체 파이프라인 실행 (추천)
npm run pipeline

# 개별 명령어
npm run typegen    # TypeScript 타입 생성
npm run seed       # 시드 데이터 삽입
npm run dbpush     # 마이그레이션 적용
```

## 🌐 배포

> **배포 테스트**: 2025-10-22 - GitHub Actions + Vercel + Render 자동 배포 파이프라인 검증 완료

### Vercel (프론트엔드)
```bash
# Vercel CLI 설치 및 배포
npm install -g vercel
vercel --prod
```

### Render (백엔드)
- GitHub 저장소를 Render에 연결
- `render.yaml` 설정 자동 적용
- 환경변수 설정 필요

### 자동 배포 프로세스
1. `master` 브랜치에 푸시
2. GitHub Actions CD 워크플로우 자동 실행
3. Supabase 마이그레이션 자동 적용
4. Vercel/Render 자동 배포 트리거

## 📊 API 엔드포인트

- `GET /healthz` - 서버 상태 확인
- `GET /api` - API 정보
- `GET /api/employees` - 직원 목록 조회
- `POST /api/employees` - 새 직원 추가
- `GET /api/test-db` - 데이터베이스 연결 테스트

## 🔧 환경 변수

```env
API_BASE_URL=http://localhost:3001
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_PW=your-db-password
```

## 📁 프로젝트 구조

```
total-admin/
├── public/           # 프론트엔드 정적 파일
│   ├── css/          # 공통/페이지별 스타일 시트
│   ├── js/           # 공통/페이지별 스크립트 모듈
│   └── *.html        # 페이지 템플릿
├── scripts/          # 자동화 스크립트
├── src/              # 소스 코드
│   └── types/        # TypeScript 타입 정의
├── supabase/         # 데이터베이스 마이그레이션
├── .github/          # GitHub Actions 워크플로우
├── server.js         # Express.js 서버
└── package.json      # 프로젝트 설정
```

## 🎯 다음 개발 계획

- [ ] 제조장비 관리 모듈
- [ ] A/S 요청 관리 시스템  
- [ ] 사용자 권한 관리
- [ ] 실시간 알림 기능
- [ ] 데이터 내보내기 기능

## 🗂️ 문서 & 작업 메모

- 로컬 `docs/` 디렉터리는 참고용 문서 보관소이며 Git에는 포함되지 않습니다.
- 협업용 문서는 Notion, Google Drive 등 외부 공간에 공유하고 README에는 링크만 유지하세요.
- 금지된 파일이 푸시되지 않도록 `scripts/git-safe-push.sh origin master` 스크립트를 사용해 주세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

**Made with ❤️ by 유니텍 개발팀**
