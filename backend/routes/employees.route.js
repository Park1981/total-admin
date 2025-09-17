import express from 'express';
import {
  httpGetAll,
  httpCreate,
  httpGetById,
  httpUpdate,
  httpDeactivate,
  httpLogin
} from '../controllers/employees.controller.js';
import { httpGetAllEmployees } from '../controllers/employees2.controller.js';

const employeesRouter = express.Router();

// 인증 API (와일드카드 라우트보다 먼저 배치)
employeesRouter.post('/login', httpLogin);             // 로그인

// 새로운 테스트 API
employeesRouter.get('/test', httpGetAllEmployees);     // 새로운 서비스 테스트

// 직원 관리 API
employeesRouter.get('/', httpGetAll);                  // 모든 직원 조회
employeesRouter.post('/', httpCreate);                 // 새 직원 생성
employeesRouter.get('/:id', httpGetById);              // 특정 직원 조회
employeesRouter.put('/:id', httpUpdate);               // 직원 정보 수정
employeesRouter.delete('/:id', httpDeactivate);        // 직원 비활성화

export default employeesRouter;