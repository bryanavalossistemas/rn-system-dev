import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  salePrice: z.number(),
  costPrice: z.number(),
  stock: z.number().int(),
  description: z.string().nullable(),
  categoryId: z.number().int().nullable(),
  brandId: z.number().int().nullable(),
  measurementUnitId: z.number().int().nullable(),
  measurementQuantity: z.number().nullable(),
  barCode: z.string().nullable(),
  sku: z.string().nullable(),
  images: z.array(z.object({ id: z.number().int(), path: z.string() })).optional(),
  showInEcommerce: z.boolean(),
  ecommerceSalePrice: z.number().nullable(),
  ecommercePercentageDiscount: z.number().int().nullable(),
  createdAt: z.date({ coerce: true }),
});
export type Product = z.infer<typeof ProductSchema>;
export const ProductsSchema = z.array(ProductSchema);

export const ProductFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  salePrice: z
    .number({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  costPrice: z
    .number({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  stock: z.number({ coerce: true }).int({ message: 'Deber ser un número entero' }).min(0, {
    message: 'El número debe ser mayor o igual a cero.',
  }),
  description: z.string(),
  categoryId: z.number().int(),
  brandId: z.number().int(),
  measurementUnitId: z.number().int(),
  measurementQuantity: z
    .number({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  barCode: z.string(),
  sku: z.string(),
  images: z.array(
    z.object({
      id: z.number().int(),
      path: z.string(),
      deleted: z.boolean().optional(),
    }),
  ),
  newImages: z.array(z.instanceof(File)),
  showInEcommerce: z.boolean(),
  ecommerceSalePrice: z
    .number({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  ecommercePercentageDiscount: z.number({ coerce: true }).int({ message: 'Deber ser un número entero' }).min(0, {
    message: 'El número debe ser mayor o igual a cero.',
  }),
});
export type ProductForm = z.infer<typeof ProductFormSchema>;
