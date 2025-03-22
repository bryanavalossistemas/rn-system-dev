import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.array(CategorySchema);

export const CreateCategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type CreateCategoryForm = z.infer<typeof CreateCategoryFormSchema>;

export const UpdateCategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
});
export type UpdateCategoryForm = z.infer<typeof UpdateCategoryFormSchema>;

export const RemoveCategoryFormSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña es obligatoria' }),
});
export type RemoveCategoryForm = z.infer<typeof RemoveCategoryFormSchema>;
