import {
  verifyAccessToken,
  TOKEN_TYPE
} from '../services/auth.service.js';

function extractBearerToken(headerValue = '') {
  if (typeof headerValue !== 'string') {
    return null;
  }

  const [scheme, token] = headerValue.split(' ');
  if (!token || scheme !== TOKEN_TYPE) {
    return null;
  }
  return token;
}

export function authenticateAccess(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    res.locals.user = payload;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({ error: 'Access token expired' });
    }

    return res.status(401).json({ error: 'Invalid authorization token' });
  }
}

export function authorizeRoles(...allowedRoles) {
  return function roleGuard(req, res, next) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    const normalizedRole = (user.role || '').toLowerCase();
    const isAllowed = allowedRoles.some(role => normalizedRole === role.toLowerCase());

    if (!isAllowed) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }

    return next();
  };
}
