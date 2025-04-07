import { z } from 'zod';

export const PurchaseSchema = z.object({
  id: z.number().int(),
  supplierId: z.number().int(),
  supplier: z.object({ name: z.string() }),
  voucher: z.object({
    serie: z.string(),
    number: z.string(),
    documentType: z.enum(['Factura', 'Boleta']),
    total: z.number(),
    subtotal: z.number(),
    tax: z.number(),
    voucherDetails: z.array(
      z.object({
        id: z.number(),
        quantity: z.number(),
        unitPrice: z.number(),
        product: z.object({
          name: z.string(),
        }),
      }),
    ),
  }),
  createdAt: z.date({ coerce: true }),
});
export type Purchase = z.infer<typeof PurchaseSchema>;
export const PurchasesSchema = z.array(PurchaseSchema);

export const VoucherDetailSchema = z.object({
  id: z.number(),
  productId: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  deleted: z.boolean().optional(),
  created: z.boolean().optional(),
  product: z.object({ name: z.string() }),
});
export type VoucherDetail = z.infer<typeof VoucherDetailSchema>;

export const VoucherDetailFormSchema = z.object({
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
export type VoucherDetailForm = z.infer<typeof VoucherDetailFormSchema>;

export const PurchaseFormSchema = z.object({
  supplierId: z.number().int().min(1, { message: 'Seleccionar proveedor' }),
  documentType: z.enum(['Factura', 'Boleta']),
  voucherDetails: z
    .array(
      z.object({
        id: z.number(),
        productId: z.number(),
        quantity: z.number(),
        unitPrice: z.number(),
        deleted: z.boolean().optional(),
        created: z.boolean().optional(),
        product: z.object({ name: z.string() }),
      }),
    )
    .refine(
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
