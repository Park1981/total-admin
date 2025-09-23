import { supabase } from '../backend/lib/supabaseClient.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

async function debugLogin() {
  console.log('🔍 로그인 디버깅 시작...');

  const username = 'admin';
  const inputPassword = 'admin123';

  try {
    // 1. 사용자 정보 조회
    console.log(`\n1️⃣ ${username} 사용자 조회 중...`);
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('❌ 사용자 조회 실패:', error);
      return;
    }

    if (!employee) {
      console.error('❌ 사용자 없음');
      return;
    }

    console.log('✅ 사용자 정보:', {
      username: employee.username,
      name: employee.name,
      active: employee.active,
      password_hash_preview: employee.password_hash?.substring(0, 20) + '...'
    });

    // 2. 비밀번호 검증
    console.log(`\n2️⃣ 비밀번호 검증 중...`);
    console.log('입력된 비밀번호:', inputPassword);
    console.log('저장된 해시:', employee.password_hash);

    const isValid = await bcrypt.compare(inputPassword, employee.password_hash);
    console.log('✅ 비밀번호 일치:', isValid);

    // 3. 테스트용 해시 생성
    console.log(`\n3️⃣ 테스트용 해시 생성...`);
    const newHash = await bcrypt.hash(inputPassword, 10);
    console.log('새로 생성된 해시:', newHash);

    const testCompare = await bcrypt.compare(inputPassword, newHash);
    console.log('새 해시 검증:', testCompare);

  } catch (error) {
    console.error('🚨 오류:', error);
  }
}

debugLogin();