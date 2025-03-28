import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  createdAt: z.date({ coerce: true }),
});
export type Category = z.infer<typeof CategorySchema>;
export const CategoriesSchema = z.array(CategorySchema);

export const CategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type CategoryForm = z.infer<typeof CategoryFormSchema>;
