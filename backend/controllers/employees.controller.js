import * as employeeService from '../services/employees.service.js';
import {
  issueAuthTokens,
  sanitizeUser,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '../services/auth.service.js';

// 데이터베이스 테스트
export async function httpTestDb(req, res) {
  try {
    const result = await employeeService.testDb();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 모든 직원 조회
export async function httpGetAll(req, res) {
  try {
    const employees = await employeeService.getAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 직원 생성
export async function httpCreate(req, res) {
  try {
    // 이제 password 필드로 받음
    const newEmployee = await employeeService.create(req.body);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}

// 직원 단일 조회
export async function httpGetById(req, res) {
  try {
    const { id } = req.params;
    const employee = await employeeService.getById(id);
    res.status(200).json(employee);
  } catch (error) {
    res.status(404).json({ error: 'Employee not found' });
  }
}

// 직원 정보 수정
export async function httpUpdate(req, res) {
  try {
    const { id } = req.params;
    const updatedEmployee = await employeeService.update(id, req.body);
    res.status(200).json({ success: true, data: updatedEmployee });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
}

// 직원 비활성화
export async function httpDeactivate(req, res) {
  try {
    const { id } = req.params;
    const deactivatedEmployee = await employeeService.deactivate(id);
    res.status(200).json({ success: true, data: deactivatedEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 로그인 API
export async function httpLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 직원 정보 조회
    const employee = await employeeService.getByUsername(username);

    if (!employee) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호 확인 (bcrypt.compare 사용)
    const isValidPassword = await employeeService.verifyPassword(password, employee.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    const { tokenType, accessToken, refreshToken } = issueAuthTokens(employee);
    const userInfo = sanitizeUser(employee);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      tokenType,
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
      user: userInfo
    });

  } catch (error) {
    // 예상치 못한 서버 오류 처리
    console.error('Login Error:', error);
    res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다.' });
  }
}
