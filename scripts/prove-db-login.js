import { supabase } from '../backend/lib/supabaseClient.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

async function proveDbLogin() {
  console.log('🔍 진짜 DB 연동 로그인인지 증명하기!');

  // 1. 현재 DB에 있는 계정들 확인
  console.log('\n1️⃣ Supabase DB에서 실제 계정 목록 조회:');
  const { data: employees, error } = await supabase
    .from('employees')
    .select('username, name, role, password_hash')
    .eq('active', true);

  if (error) {
    console.error('❌ DB 조회 실패:', error);
    return;
  }

  console.table(employees.map(emp => ({
    username: emp.username,
    name: emp.name,
    role: emp.role,
    hash_preview: emp.password_hash.substring(0, 15) + '...'
  })));

  // 2. 새로운 임시 계정을 DB에 추가
  console.log('\n2️⃣ 새로운 임시 테스트 계정 생성:');
  const tempUsername = 'temp_' + Date.now();
  const tempPassword = 'temp123';
  const tempHash = await bcrypt.hash(tempPassword, 10);

  const { data: newUser, error: insertError } = await supabase
    .from('employees')
    .insert([{
      username: tempUsername,
      password_hash: tempHash,
      name: '임시계정',
      title: 'Temp User',
      role: 'staff',
      active: true,
      mobile: '010-9999-9999',
      email: `${tempUsername}@test.com`
    }])
    .select('username, name')
    .single();

  if (insertError) {
    console.error('❌ 임시 계정 생성 실패:', insertError);
    return;
  }

  console.log('✅ 임시 계정 생성:', newUser);

  // 3. 방금 만든 계정으로 API 로그인 테스트
  console.log('\n3️⃣ 임시 계정으로 실제 API 호출:');

  const loginData = {
    username: tempUsername,
    password: tempPassword
  };

  try {
    // fetch가 없으니 curl 명령어로 테스트할 준비
    console.log('📝 다음 명령어로 테스트하세요:');
    console.log(`curl -X POST https://total-admin.onrender.com/api/employees/login \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"username":"${tempUsername}","password":"${tempPassword}"}'`);

    // 4. 임시 계정 삭제
    setTimeout(async () => {
      await supabase
        .from('employees')
        .delete()
        .eq('username', tempUsername);
      console.log('\n🗑️ 임시 계정 삭제 완료');
    }, 5000);

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

proveDbLogin();