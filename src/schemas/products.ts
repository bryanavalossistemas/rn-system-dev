import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  salePrice: z.number(),
  costPrice: z.number(),
  stock: z.number().int(),
  categoryId: z.number().int().nullable(),
  brandId: z.number().int().nullable(),
  images: z.array(z.object({ id: z.number().int(), path: z.string() })).optional(),
  createdAt: z.date({ coerce: true }),
});
export type Product = z.infer<typeof ProductSchema>;
export const ProductsSchema = z.array(ProductSchema);

export const ProductFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  salePrice: z
    .string({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  costPrice: z
    .string({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  stock: z.number({ coerce: true }).int({ message: 'Deber ser un número entero' }).min(0, {
    message: 'El número debe ser mayor o igual a cero.',
  }),
  categoryId: z.number().int(),
  brandId: z.number().int(),
  newImages: z.array(z.instanceof(File)),
  images: z.array(
    z.object({
      id: z.number().int(),
      path: z.string(),
      deleted: z.boolean().optional(),
    }),
  ),
});
export type ProductForm = z.infer<typeof ProductFormSchema>;
