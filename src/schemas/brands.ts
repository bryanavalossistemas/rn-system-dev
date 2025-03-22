import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type Brand = z.infer<typeof BrandSchema>;

export const BrandsSchema = z.array(BrandSchema);

export const CreateBrandFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type CreateBrandForm = z.infer<typeof CreateBrandFormSchema>;

export const UpdateBrandFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type UpdateBrandForm = z.infer<typeof UpdateBrandFormSchema>;

export const RemoveBrandFormSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña es obligatoria' }),
});
export type RemoveBrandForm = z.infer<typeof RemoveBrandFormSchema>;
