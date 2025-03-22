import api from '@/config/axios';
import { CategoriesSchema, Category, CategorySchema, CreateCategoryForm, UpdateCategoryForm } from '@/schemas/categories';

export const create = async ({ formData }: { formData: CreateCategoryForm }) => {
  return CategorySchema.parse((await api.post('/categories', formData)).data);
};

export const findAll = async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  let res;

  if (startDate && endDate) {
    res = await api.get(`/categories?startDate=${startDate}&endDate=${endDate}`);
  } else {
    res = await api.get('/categories');
  }

  return CategoriesSchema.parse(res.data);
};

export const findOne = async (id: Category['id']) => {
  return CategorySchema.parse((await api.get(`/categories/${id}`)).data);
};

export const update = async ({ id, formData }: { id: Category['id']; formData: UpdateCategoryForm }) => {
  return CategorySchema.parse((await api.patch(`/categories/${id}`, formData)).data);
};

export const remove = async ({ id }: { id: Category['id'] }) => {
  await api.delete(`/categories/${id}`);
};
