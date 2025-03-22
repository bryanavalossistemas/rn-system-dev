import { z } from 'zod';

export const TokenSchema = z.object({
  token: z.string().min(6, {
    message: 'Su token debe tener 6 caracteres',
  }),
});
export type Token = z.infer<typeof TokenSchema>;

export const RegisterFormSchema = z.object({
  email: z.string().email({ message: 'Email no válido' }),
  password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
});
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Email no válido' }),
  password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
});
export type LoginForm = z.infer<typeof LoginFormSchema>;

export const ForgotFormSchema = z.object({
  email: z.string().email({ message: 'Email no válido' }),
});
export type ForgotForm = z.infer<typeof ForgotFormSchema>;

export const ResetPasswordFormSchema = z.object({
  password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
  token: z.string().min(6, {
    message: 'Su token debe tener 6 caracteres',
  }),
});
export type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;
