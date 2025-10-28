const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const Firm = require('../models/firmModel');

/**
 * Tenant middleware - CRITICAL for multi-tenant data isolation
 * Attaches tenant context to all requests to prevent data leakage
 * Must be applied BEFORE all API routes
 */
const tenantMiddleware = async (req, res, next) => {
  try {
    // Skip tenant middleware for login and public routes
    const publicRoutes = ['/api/auth', '/api/health', '/api/status'];
    if (publicRoutes.includes(req.path)) {
      console.log(`[TENANT] Skipping tenant middleware for public route: ${req.path}`);
      return next();
    }

    // Extract token from cookies or Authorization header
    // FIXED: Check if req.cookies exists before accessing it
    const token = (req.cookies && req.cookies.auth_token) ||
                  req.headers.authorization?.split(' ')[1];

    console.log(`[TENANT] ===========================================`);
    console.log(`[TENANT] Processing request to: ${req.path}`);
    console.log(`[TENANT] Method: ${req.method}`);
    console.log(`[TENANT] Token from cookie: ${(req.cookies && req.cookies.auth_token) ? 'YES' : 'NO'}`);
    console.log(`[TENANT] Token from header: ${req.headers.authorization ? 'YES' : 'NO'}`);
    console.log(`[TENANT] Authorization header: ${req.headers.authorization || 'NOT PROVIDED'}`);
    console.log(`[TENANT] Final token: ${token ? 'FOUND' : 'MISSING'}`);
    if (token) {
      console.log(`[TENANT] Token preview: ${token.substring(0, 20)}...`);
    }
    console.log(`[TENANT] ===========================================`);

    if (!token) {
      console.log(`[TENANT] ❌ No authentication token provided for ${req.path}`);
      return res.status(401).json({
        error: 'No authentication token provided',
        message: 'Please log in to access this resource'
      });
    }

    // Decode JWT and find user with firm association
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(decoded._id).populate('firmId');

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'Invalid authentication token'
      });
    }

    if (!user.firmId) {
      return res.status(403).json({
        error: 'User not associated with any firm',
        message: 'Please contact administrator to assign you to a firm'
      });
    }

    // Attach tenant context to request (CRITICAL for data isolation)
    req.user = user;
    req.tenant = user.firmId;
    req.tenantId = user.firmId._id;
    req.userRole = user.role;

    // Log tenant access for audit (optional but recommended)
    console.log(`[TENANT] User ${user.email} (${user.role}) accessing as tenant: ${user.firmId.name} (${user.firmId.type})`);

    next();
  } catch (error) {
    console.error('[TENANT MIDDLEWARE ERROR]:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again',
        expiredAt: error.expiredAt
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please log in again'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
};

module.exports = tenantMiddleware;
