import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import apiRouter from './routes/index.js';
import { authenticateAccess } from './middleware/auth.middleware.js';

const app = express();

// CORS 설정
const corsOptions = {
  origin: [
    'https://total-admin-brown.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000',
    'http://127.0.0.1:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public')); // Serve static files

const openApiRoutes = new Set(['/api/employees/login']);

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return next();
  }

  if (req.method === 'OPTIONS' || openApiRoutes.has(req.path)) {
    return next();
  }

  return authenticateAccess(req, res, next);
});

// App-level routes
app.get('/healthz', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'total-admin',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Keep-alive 전용 엔드포인트 (GitHub Actions용)
app.get('/keep-alive', (req, res) => {
  console.log(`🔔 Keep-alive ping received at ${new Date().toISOString()}`);
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    message: 'Server is awake and running',
    uptime: `${Math.floor(process.uptime())} seconds`
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// API routes
app.use('/api', apiRouter);

export default app;
