import { ProductSchema } from '@/schemas/products';
import { CustomerSchema } from '@/schemas/customers';
import { z } from 'zod';

const SaleDetailBaseSchema = z.object({
  id: z.number().int(),
  productName: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  costPrice: z.number(),
  productId: z.number().int(),
  product: ProductSchema.nullable().optional(),
  saleId: z.number().int(),
  createdAt: z.date({ coerce: true }),
});
export const SaleDetailSchema = SaleDetailBaseSchema.extend({
  sale: z.lazy(() => SaleBaseSchema.optional()),
});
export type SaleDetail = z.infer<typeof SaleDetailSchema>;

const SaleBaseSchema = z.object({
  id: z.number().int(),
  documentType: z.enum(['Factura', 'Boleta']),
  documentNumber: z.string(),
  customerName: z.string(),
  customerDocumentNumber: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  customerId: z.number().int().nullable(),
  customer: CustomerSchema.nullable().optional(),
  createdAt: z.date({ coerce: true }),
});

export const SaleSchema = SaleBaseSchema.extend({
  saleDetails: z.lazy(() => z.array(SaleDetailBaseSchema)),
});
export const SalesSchema = z.array(SaleSchema);
export type Sale = z.infer<typeof SaleSchema>;

export const SaleDetailFormSchema = z.object({
  id: z.number().int(),
  productId: z.number().int().min(1, { message: 'Debe seleccionar un producto' }),
  productName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  quantity: z.number({ coerce: true }).int().min(1, { message: 'Cantidad positiva' }),
  costPrice: z.number(),
  unitPrice: z
    .string({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
  images: z.array(z.object({ id: z.number().int(), path: z.string() })).optional(),
  created: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
export type SaleDetailForm = z.infer<typeof SaleDetailFormSchema>;

export const SaleFormSchema = z.object({
  customerId: z.number().int().min(1, { message: 'Seleccionar cliente' }).nullable(),
  documentType: z.enum(['Factura', 'Boleta']),
  saleDetails: z.array(SaleDetailFormSchema).refine(
    (value) => {
      if (value.length > 0 && value.some((v) => v.deleted === undefined)) {
        return true;
      }

      return false;
    },
    { message: 'Mínimo un detalle' },
  ),
});
export type SaleForm = z.infer<typeof SaleFormSchema>;
