import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import apiRouter from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// App-level routes
app.get('/healthz', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'total-admin',
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// API routes
app.use('/api', apiRouter);

export default app;