// 완전히 새로운 employees 컨트롤러
import { getAllEmployees } from '../services/employees2.service.js';

export async function httpGetAllEmployees(req, res) {
  console.log('🎯 httpGetAllEmployees 컨트롤러 호출됨');

  try {
    const employees = await getAllEmployees();
    console.log('✅ 컨트롤러에서 데이터 받음:', employees.length, '개');

    res.status(200).json(employees);
  } catch (error) {
    console.error('❌ 컨트롤러 에러:', error.message);
    res.status(500).json({
      error: error.message,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}