import { supabase } from '../lib/supabaseClient.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const EMPLOYEE_FIELDS = 'employee_id, username, name, title, mobile, email, role, active, created_at';

function ensureFound(data, message = 'Employee not found') {
  if (!data) {
    const err = new Error(message);
    err.statusCode = 404;
    throw err;
  }
  return data;
}

function wrapError(originMessage, error) {
  if (error?.code === 'PGRST116') {
    const notFound = new Error(originMessage);
    notFound.statusCode = 404;
    throw notFound;
  }

  const err = new Error(error?.message || originMessage || 'Database operation failed');
  err.statusCode = error?.status || 500;
  throw err;
}

export async function testDb() {
  const { count, error } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true });

  if (error) {
    wrapError('Failed to query employees table', error);
  }

  return { table: 'employees', count };
}

export async function getAll() {
  const { data, error } = await supabase
    .from('employees')
    .select(EMPLOYEE_FIELDS)
    .eq('active', true)
    .order('created_at');

  if (error) {
    wrapError('Failed to load employees', error);
  }

  return data ?? [];
}

export async function getById(employeeId) {
  const { data, error } = await supabase
    .from('employees')
    .select(EMPLOYEE_FIELDS)
    .eq('employee_id', employeeId)
    .single();

  if (error) {
    wrapError('Employee not found', error);
  }

  return ensureFound(data);
}

export async function create(payload) {
  const {
    username,
    password,
    password_hash: passwordHashCandidate,
    name,
    title,
    mobile,
    email,
    role = 'staff'
  } = payload ?? {};

  const rawPassword = password ?? passwordHashCandidate;

  if (!username || !rawPassword || !name) {
    const err = new Error('Username, password, and name are required');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS);

  const insertPayload = {
    username,
    password_hash: hashedPassword,
    name,
    title,
    mobile,
    email,
    role,
    active: true
  };

  const { data, error } = await supabase
    .from('employees')
    .insert([insertPayload])
    .select(EMPLOYEE_FIELDS)
    .single();

  if (error) {
    wrapError('Failed to create employee', error);
  }

  return data;
}

export async function update(employeeId, updateData = {}) {
  const {
    password,
    password_hash: passwordHashCandidate,
    ...rest
  } = updateData;

  const updates = { ...rest };

  const rawPassword = password ?? passwordHashCandidate;
  if (rawPassword) {
    updates.password_hash = await bcrypt.hash(rawPassword, SALT_ROUNDS);
  }

  if (Object.keys(updates).length === 0) {
    return getById(employeeId);
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('employee_id', employeeId)
    .select(EMPLOYEE_FIELDS)
    .single();

  if (error) {
    wrapError('Failed to update employee', error);
  }

  return ensureFound(data);
}

export async function deactivate(employeeId) {
  const { data, error } = await supabase
    .from('employees')
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq('employee_id', employeeId)
    .select(EMPLOYEE_FIELDS)
    .single();

  if (error) {
    wrapError('Failed to deactivate employee', error);
  }

  return ensureFound(data, 'Employee not found');
}

export async function getByUsername(username) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    wrapError('Failed to load employee', error);
  }

  return data;
}

export function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
}
