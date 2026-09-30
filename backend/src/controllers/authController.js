import * as authService from '../services/authService.js';
import { success, error } from '../utils.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.signUp(req.body);
    return success(res, result, 'Account created.', 201);
  } catch (err) {
    if (err.status) return error(res, err.message, err.status);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.signIn(req.body);
    return success(res, result, 'Login successful.');
  } catch (err) {
    if (err.status) return error(res, err.message, err.status);
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    if (!result) return error(res, 'User not found.', 404);
    return success(res, result, 'User fetched.');
  } catch (err) {
    next(err);
  }
};