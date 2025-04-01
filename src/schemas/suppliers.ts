import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  documentType: z.enum(['RUC', 'DNI']),
  documentNumber: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  createdAt: z.date({ coerce: true }),
});
export type Supplier = z.infer<typeof SupplierSchema>;
export const SuppliersSchema = z.array(SupplierSchema);

export const SupplierFormSchema = z
  .object({
    name: z.string().min(1, { message: 'El nombre es obligatorio' }),
    documentType: z.enum(['RUC', 'DNI']),
    documentNumber: z.string(),
    address: z.string(),
    phone: z
      .string()
      .regex(/^\d{7}$|^\d{9}$/, { message: 'El teléfono debe contener 7 u 9 dígitos' })
      .or(z.literal('')),
    email: z.string().email({ message: 'Correo no válido' }).or(z.literal('')),
  })
  .superRefine((value, ctx) => {
    const { documentType, documentNumber } = value;

    if (documentType === 'RUC' && documentNumber.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El RUC debe tener 11 dígitos',
        path: ['documentNumber'],
      });
    }

    if (documentType === 'DNI' && documentNumber.length !== 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El DNI debe tener 8 dígitos',
        path: ['documentNumber'],
      });
    }
  });
export type SupplierForm = z.infer<typeof SupplierFormSchema>;
