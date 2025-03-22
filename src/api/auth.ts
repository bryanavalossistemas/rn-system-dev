import api from '@/config/axios';
import { ForgotForm, LoginForm, RegisterForm, ResetPasswordForm, Token } from '@/schemas/auth';

export const register = async (formData: RegisterForm) => {
  await api.post('/auth/register', formData);
};

export const google = async (code: string) => {
  return await api.post('/auth/google', { code });
};

export const verifyEmail = async (formData: Token) => {
  await api.post('/auth/verify-email', formData);
};

export const login = async (formData: LoginForm) => {
  return await api.post('/auth/login', formData);
};

export const forgotPassword = async (formData: ForgotForm) => {
  await api.post('/auth/forgot-password', formData);
};

export const resetPassword = async (formData: ResetPasswordForm) => {
  await api.post('/auth/reset-password', formData);
};
