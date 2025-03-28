import { z } from 'zod';
import { ProductSchema } from '@/schemas/products';

export const DetailSchema = z.object({
  id: z.number().int(),
  productName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  quantity: z.number().int(),
  product: ProductSchema,
  unitPrice: z.number(),
  createdAt: z.date({ coerce: true }),
  created: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
export type Detail = z.infer<typeof DetailSchema>;

export const DetailFormSchema = z.object({
  productId: z.number().int().min(1, { message: 'Debe seleccionar un producto' }),
  productName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  quantity: z.number({ coerce: true }).int().min(1, { message: 'Cantidad positiva' }),
  unitPrice: z
    .string({ coerce: true })
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    }),
});
export type DetailForm = z.infer<typeof DetailFormSchema>;

export const PurchaseSchema = z.object({
  id: z.number().int(),
  supplierName: z.string(),
  supplierDocument: z.string(),
  document: z
    .object({
      id: z.number().int().optional(),
      documentNumber: z.string().optional(),
      documentSerie: z.string().optional(),
      subtotal: z.number().optional(),
      tax: z.number().optional(),
      total: z.number().optional(),
      createdAt: z.date({ coerce: true }).optional(),
      documentType: z
        .object({
          id: z.number().int(),
        })
        .optional(),
      documentDetails: z.array(DetailSchema).optional(),
    })
    .optional(),
  supplier: z
    .object({
      id: z.number().int(),
    })
    .optional(),
  createdAt: z.date({ coerce: true }),
});
export type Purchase = z.infer<typeof PurchaseSchema>;
export const PurchasesSchema = z.array(PurchaseSchema);

export const PurchaseFormSchema = z.object({
  supplierId: z.number().int().min(1, { message: 'Seleccionar proveedor' }),
  documentTypeId: z.number({ coerce: true }).int().min(1, { message: 'Seleccionar tipo' }),
  documentDetails: z.array(DetailSchema).refine(
    (value) => {
      if (value.length > 0 && value.some((v) => v.deleted === undefined)) {
        return true;
      }

      return false;
    },
    { message: 'Mínimo un detalle' },
  ),
});
export type PurchaseForm = z.infer<typeof PurchaseFormSchema>;
