// 유니텍 관리시스템 서버
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 정적 파일 서빙

// 헬스체크 엔드포인트
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'total-admin',
    version: '1.0.0'
  });
});

// 기본 루트 엔드포인트 - HTML 페이지 서빙
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// API 루트
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Total Admin API',
    version: '1.0.0',
    endpoints: [
      '/healthz',
      '/api/test-db',
      '/api/employees'
    ]
  });
});

// 데이터베이스 연결 테스트
app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('count(*)')
      .single();
    
    if (error) {
      return res.status(500).json({ 
        error: error.message,
        success: false 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Database connection successful',
      tables: 'customers',
      count: data?.count || 0
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      success: false 
    });
  }
});

// 직원 목록 (customers 테이블을 직원으로 사용)
app.get('/api/employees', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, email')
      .order('id');
    
    if (error) {
      return res.status(500).json({ 
        error: error.message,
        success: false 
      });
    }
    
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      success: false 
    });
  }
});

// 새 직원 추가
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'Name is required',
        success: false 
      });
    }
    
    const { data, error } = await supabase
      .from('customers')
      .insert([{ name, email }])
      .select();
    
    if (error) {
      return res.status(500).json({ 
        error: error.message,
        success: false 
      });
    }
    
    res.json({ 
      success: true,
      data: data[0] 
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      success: false 
    });
  }
});

app.listen(port, () => {
  console.log(`✅ 유니텍 관리시스템 서버 실행 중: http://localhost:${port}`);
  console.log(`📊 테스트 페이지: http://localhost:${port}`);
  console.log(`🔗 API 엔드포인트: http://localhost:${port}/api`);
});