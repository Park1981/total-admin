import * as employeeService from '../services/employees.service.js';

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

    // 비밀번호 확인 (일단 평문 비교)
    if (employee.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 비밀번호 제외하고 반환
    const { password_hash, ...userInfo } = employee;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userInfo
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}
