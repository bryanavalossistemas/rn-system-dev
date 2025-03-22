import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email({ message: 'Email no válido' }),
  password: z.string().min(8, { message: 'Mínimo 8 caracteres' }),
});
export type User = z.infer<typeof UserSchema>;
