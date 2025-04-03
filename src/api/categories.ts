import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { CategoriesSchema, Category, CategorySchema, CategoryForm } from '@/schemas/categories';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: CategoryForm }) => {
  const formData = new FormData();
  const { name, newImage } = data;
  formData.append('name', name);
  if (newImage) formData.append('image', newImage);

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

export const update = async ({ id, formData: data }: { id: Category['id']; formData: CategoryForm }) => {
  const formData = new FormData();
  const { name, newImage, oldImage } = data;
  formData.append('name', name);
  if (newImage) formData.append('image', newImage);
  if (oldImage) formData.append('oldImage', oldImage);

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
