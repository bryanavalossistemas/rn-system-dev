import { z } from 'zod';

export const MeasurementUnitSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  prefix: z.string(),
  createdAt: z.date({ coerce: true }),
});
export type MeasurementUnit = z.infer<typeof MeasurementUnitSchema>;

export const MeasurementUnitsSchema = z.array(MeasurementUnitSchema);

export const MeasurementUnitFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  prefix: z.string().min(1, { message: 'El prefijo es obligatorio' }),
});
export type MeasurementUnitForm = z.infer<typeof MeasurementUnitFormSchema>;
