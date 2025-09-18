import { supabase } from '../lib/supabaseClient.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// 데이터베이스 테스트
export async function testDb() {
  const { count, error } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(error.message);
  }

  return { table: 'employees', count };
}

// 원래 스타일로 간단하게
export async function getAll() {
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id, username, name, title, mobile, email, role, active, created_at')
    .eq('active', true)
    .order('created_at');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function create({ username, password, name, title, mobile, email, role = 'staff' }) {
  if (!username || !password || !name) {
    const err = new Error('Username, password, and name are required');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const { data, error } = await supabase
    .from('employees')
    .insert([{ username, password_hash: hashedPassword, name, title, mobile, email, role, active: true }])
    .select('employee_id, username, name, title, mobile, email, role, active, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getByUsername(username) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    // 사용자 정보가 없을 때 null을 반환하도록 수정
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
