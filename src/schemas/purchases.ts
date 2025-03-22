import { z } from 'zod';

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
      documentDetails: z
        .array(
          z.object({
            id: z.number().int(),
            productName: z.string(),
            quantity: z.number().int(),
            unitPrice: z.number(),
            product: z
              .object({
                id: z.number().int(),
              })
              .optional(),
            createdAt: z.date({ coerce: true }).optional(),
          }),
        )
        .optional(),
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

export const DetailFormSchema = z.object({
  id: z.number().int().optional(),
  key: z.number().int().optional(),
  productId: z.string().min(1, { message: 'Debe seleccionar un producto' }),
  productName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  quantity: z
    .number({ coerce: true })
    .int({ message: 'El número debe ser entero' })
    .min(1, { message: 'El número debe ser positivo' })
    .transform(String),
  unitPrice: z
    .string()
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'El número debe tener como máximo dos decimales',
    })
    .transform(Number)
    .refine((val) => val >= 0, {
      message: 'El número debe ser mayor o igual a cero.',
    })
    .transform(String),
  deleted: z.boolean().optional(),
});
export type DetailForm = z.infer<typeof DetailFormSchema>;

export const PurchaseFormSchema = z.object({
  supplierId: z.string().min(1, { message: 'Seleccionar proveedor' }),
  documentTypeId: z.string().min(1, { message: 'Seleccionar tipo' }),
  documentDetails: z.array(DetailFormSchema).refine(
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
