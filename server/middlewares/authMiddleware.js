import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Seller from '../models/Seller.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load user based on role
      let userObj = null;
      if (decoded.role === 'admin') {
        userObj = await Admin.findById(decoded.id).select('-password');
      } else if (decoded.role === 'seller') {
        userObj = await Seller.findById(decoded.id).select('-password');
      } else if (decoded.role === 'user') {
        userObj = await User.findById(decoded.id).select('-password');
      }

      if (!userObj) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      // Check if user is blocked or seller is not approved
      if (decoded.role === 'user' && userObj.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'User account is blocked',
        });
      }

      if (decoded.role === 'seller' && !userObj.isApproved) {
        return res.status(403).json({
          success: false,
          message: 'Seller account is not approved',
        });
      }

      req.user = userObj;
      req.user.role = decoded.role; // Attach role for simple checking
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required',
    });
  }
};

export const sellerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Seller role required',
    });
  }
};

export const userOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: User role required',
    });
  }
};
