import { ProductSchema } from '@/schemas/products';
import { SupplierSchema } from '@/schemas/suppliers';
import { z } from 'zod';

const PurchaseDetailBaseSchema = z.object({
  id: z.number().int(),
  productName: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  productId: z.number().int(),
  product: ProductSchema.optional(),
  purchaseId: z.number().int(),
  createdAt: z.date({ coerce: true }),
});
export const PurchaseDetailSchema = PurchaseDetailBaseSchema.extend({
  purchase: z.lazy(() => PurchaseBaseSchema.optional()),
});
export type PurchaseDetail = z.infer<typeof PurchaseDetailSchema>;

const PurchaseBaseSchema = z.object({
  id: z.number().int(),
  documentType: z.enum(['Factura', 'Boleta']),
  documentNumber: z.string(),
  supplierName: z.string(),
  supplierDocumentNumber: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  supplierId: z.number().int(),
  supplier: SupplierSchema.optional(),
  createdAt: z.date({ coerce: true }),
});

export const PurchaseSchema = PurchaseBaseSchema.extend({
  purchaseDetails: z.lazy(() => z.array(PurchaseDetailBaseSchema)),
});
export const PurchasesSchema = z.array(PurchaseSchema);
export type Purchase = z.infer<typeof PurchaseSchema>;

export const PurchaseDetailFormSchema = z.object({
  id: z.number().int(),
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
  created: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
export type PurchaseDetailForm = z.infer<typeof PurchaseDetailFormSchema>;

export const PurchaseFormSchema = z.object({
  supplierId: z.number().int().min(1, { message: 'Seleccionar proveedor' }),
  documentType: z.enum(['Factura', 'Boleta']),
  purchaseDetails: z.array(PurchaseDetailFormSchema).refine(
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
