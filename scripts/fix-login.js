import { supabase } from '../backend/lib/supabaseClient.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const SALT_ROUNDS = 10;

async function createTestAccounts() {
  console.log('🔧 bcrypt 해싱된 테스트 계정 생성 중...');

  // 기존 admin 계정 삭제 후 새로 생성
  const accounts = [
    { username: 'admin', password: 'admin123', name: '관리자', title: 'Administrator', role: 'admin' },
    { username: 'manager1', password: 'manager123', name: '매니저1', title: 'Manager', role: 'manager' },
    { username: 'jpark', password: 'jpark123', name: '박정완', title: 'Developer', role: 'staff' }
  ];

  try {
    for (const account of accounts) {
      // 기존 계정 삭제
      await supabase
        .from('employees')
        .delete()
        .eq('username', account.username);

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(account.password, SALT_ROUNDS);

      // 새 계정 생성
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          username: account.username,
          password_hash: hashedPassword,
          name: account.name,
          title: account.title,
          role: account.role,
          active: true,
          mobile: '010-1234-5678',
          email: `${account.username}@unitech.co.kr`
        }])
        .select('username, name, role')
        .single();

      if (error) {
        console.error(`❌ ${account.username} 생성 실패:`, error.message);
      } else {
        console.log(`✅ ${account.username} 계정 생성 완료 (${account.password})`);
      }
    }

    // 최종 확인
    const { data: allEmployees } = await supabase
      .from('employees')
      .select('username, name, role, active')
      .eq('active', true);

    console.log('\n📋 현재 활성 계정 목록:');
    console.table(allEmployees);

  } catch (error) {
    console.error('🚨 오류 발생:', error);
  }
}

createTestAccounts();