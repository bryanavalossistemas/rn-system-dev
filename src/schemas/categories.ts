import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.date({ coerce: true }),
});
export type Category = z.infer<typeof CategorySchema>;
export const CategoriesSchema = z.array(CategorySchema);

export const CategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  newImage: z.instanceof(File).nullable(),
  image: z.string().nullable(),
});
export type CategoryForm = z.infer<typeof CategoryFormSchema>;
