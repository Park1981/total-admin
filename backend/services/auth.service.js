import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const AUTH_TOKEN_TYPE = 'Bearer';

function toPayload(user = {}) {
  return {
    sub: user.employee_id,
    username: user.username,
    role: user.role,
    name: user.name
  };
}

export const ACCESS_TOKEN_EXPIRES_IN = config.jwt.accessExpiresIn;
export const REFRESH_TOKEN_EXPIRES_IN = config.jwt.refreshExpiresIn;
export const TOKEN_TYPE = AUTH_TOKEN_TYPE;

export function issueAccessToken(user) {
  return jwt.sign(toPayload(user), config.jwt.secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function issueRefreshToken(user) {
  return jwt.sign({ ...toPayload(user), type: 'refresh' }, config.jwt.secret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });
}

export function issueAuthTokens(user) {
  return {
    tokenType: AUTH_TOKEN_TYPE,
    accessToken: issueAccessToken(user),
    refreshToken: issueRefreshToken(user)
  };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

export function sanitizeUser(user = {}) {
  const {
    password_hash,
    ...safe
  } = user;
  return safe;
}
