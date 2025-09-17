import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  db: { schema: 'public' },
  auth: { autoRefreshToken: false, persistSession: false }
});

console.log('🔍 스키마 및 외래키 관계 확인');

// 1. 현재 테이블 목록 확인
async function checkTables() {
  try {
    console.log('\n📋 1. 테이블 목록 확인...');

    // information_schema 대신 pg_tables 사용
    const { data, error } = await supabase.rpc('get_table_list');

    if (error) {
      console.log('❌ 테이블 목록 조회 실패:', error.message);
      // 대안: 직접 employees 테이블 체크
      console.log('💡 직접 employees 테이블 확인...');
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select('count(*)')
        .single();

      if (empError) {
        console.log('❌ employees 테이블 접근 실패:', empError.message);
      } else {
        console.log('✅ employees 테이블 정상 접근 가능');
      }
    } else {
      console.log('✅ 테이블 목록:', data);
    }
  } catch (error) {
    console.log('❌ 테이블 체크 에러:', error.message);
  }
}

// 2. employees 테이블 스키마 확인
async function checkEmployeesSchema() {
  try {
    console.log('\n🏗️ 2. employees 테이블 스키마 확인...');

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ employees 스키마 확인 실패:', error.message);
    } else {
      console.log('✅ employees 테이블 구조:');
      if (data && data.length > 0) {
        console.log('컬럼들:', Object.keys(data[0]));
      }
    }
  } catch (error) {
    console.log('❌ employees 스키마 체크 에러:', error.message);
  }
}

// 3. 캐시 관련 정보 확인
async function checkCacheStatus() {
  try {
    console.log('\n🔄 3. PostgREST 캐시 상태 확인...');

    // PostgREST 정보 조회 시도
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ PostgREST 응답:', data);
    } else {
      console.log('❌ PostgREST 응답 실패:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ PostgREST 체크 에러:', error.message);
  }
}

async function main() {
  await checkTables();
  await checkEmployeesSchema();
  await checkCacheStatus();

  console.log('\n🎯 스키마 체크 완료');
}

main();