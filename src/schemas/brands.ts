import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  createdAt: z.date({ coerce: true }),
});
export type Brand = z.infer<typeof BrandSchema>;

export const BrandsSchema = z.array(BrandSchema);

export const BrandFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type BrandForm = z.infer<typeof BrandFormSchema>;
