// 완전히 독립적인 새로운 employees 서비스
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// 환경변수 직접 출력해서 확인
console.log('🔍 환경변수 확인:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

// 완전히 새로운 클라이언트 인스턴스
const client = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
  auth: { autoRefreshToken: false, persistSession: false }
});

console.log('✅ 새로운 Supabase 클라이언트 생성 완료');

// 모든 직원 조회 - 완전히 새로운 구현
export async function getAllEmployees() {
  console.log('🚀 getAllEmployees() 시작');

  try {
    console.log('📋 employees 테이블 쿼리 실행...');

    const { data, error } = await client
      .from('employees')
      .select('employee_id, username, name, title, mobile, email, role, active, created_at')
      .eq('active', true)
      .order('created_at');

    if (error) {
      console.error('❌ Supabase 에러 발생:', JSON.stringify(error, null, 2));
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✅ 성공! 조회된 데이터:', data?.length || 0, '개');
    console.log('📊 데이터 샘플:', data?.[0] || 'No data');

    return data || [];
  } catch (error) {
    console.error('❌ getAllEmployees 에러:', error.message);
    console.error('📍 에러 스택:', error.stack);
    throw error;
  }
}