import api from '@/config/axios';
import { delay, getDateRange } from '@/lib/utils';
import { CategoriesSchema, Category, CategorySchema, CategoryForm } from '@/schemas/categories';
import { isAxiosError } from 'axios';

export const create = async ({ formData }: { formData: CategoryForm }) => {
  try {
    return CategorySchema.parse((await api.post('/categories', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/categories');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/categories?startDate=${startDate}&endDate=${endDate}`);
  }

  return CategoriesSchema.parse(res.data);
};

export const update = async ({ id, formData }: { id: Category['id']; formData: CategoryForm }) => {
  try {
    return CategorySchema.parse((await api.patch(`/categories/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Category['id'] }) => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
