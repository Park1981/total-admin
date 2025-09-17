// 완전히 새로운 employees 서비스 파일
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// 직접 새로운 Supabase 클라이언트 생성
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  auth: { autoRefreshToken: false, persistSession: false }
});

// 모든 직원 조회
export async function getAll() {
  console.log('🔍 employees.getAll() 호출됨');

  try {
    const { data, error } = await supabase
      .from('employees')
      .select('employee_id, username, name, title, mobile, email, role, active, created_at')
      .eq('active', true)
      .order('created_at');

    if (error) {
      console.error('❌ Supabase 에러:', error);
      throw new Error(error.message);
    }

    console.log('✅ employees 데이터 조회 성공:', data?.length || 0, '개');
    return data || [];
  } catch (error) {
    console.error('❌ getAll 에러:', error.message);
    throw error;
  }
}

// 직원 생성
export async function create({ username, password_hash, name, title, mobile, email, role = 'staff' }) {
  if (!username || !password_hash || !name) {
    const err = new Error('Username, password, and name are required');
    err.statusCode = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from('employees')
    .insert([{ username, password_hash, name, title, mobile, email, role, active: true }])
    .select('employee_id, username, name, title, mobile, email, role, active, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// 직원 ID로 조회
export async function getById(employee_id) {
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id, username, name, title, mobile, email, role, active, created_at')
    .eq('employee_id', employee_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// 사용자명으로 직원 조회 (로그인용)
export async function getByUsername(username) {
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id, username, password_hash, name, title, role, active')
    .eq('username', username)
    .eq('active', true)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// 직원 정보 수정
export async function update(employee_id, updateData) {
  const { password_hash, ...safeData } = updateData;

  const { data, error } = await supabase
    .from('employees')
    .update(safeData)
    .eq('employee_id', employee_id)
    .select('employee_id, username, name, title, mobile, email, role, active, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// 직원 비활성화 (삭제 대신)
export async function deactivate(employee_id) {
  const { data, error } = await supabase
    .from('employees')
    .update({ active: false })
    .eq('employee_id', employee_id)
    .select('employee_id, username, name, active')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}