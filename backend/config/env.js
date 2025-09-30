import 'dotenv/config';

const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.JEST_WORKER_ID);

const config = {
  env: process.env.NODE_ENV ?? 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d'
  }
};

if (!config.jwt.secret) {
  if (isTestEnv) {
    config.jwt.secret = 'test-fallback-secret';
  } else {
    throw new Error('JWT_SECRET must be defined in environment variables');
  }
}

export default config;
