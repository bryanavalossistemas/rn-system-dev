import api from '@/config/axios';
import { delay, getDateRange } from '@/lib/utils';
import { ProductSchema, ProductsSchema, Product, ProductForm } from '@/schemas/products';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: ProductForm }) => {
  const formData = new FormData();
  const { name, salePrice, costPrice, stock, categoryId, brandId, newImages } = data;
  formData.append('name', name);
  formData.append('salePrice', `${salePrice}`);
  formData.append('costPrice', `${costPrice}`);
  formData.append('stock', `${stock}`);
  if (categoryId) formData.append('categoryId', `${categoryId}`);
  if (brandId) formData.append('brandId', `${brandId}`);
  if (newImages.length > 0) {
    newImages.forEach((image) => {
      formData.append('images', image);
    });
  }

  try {
    return ProductSchema.parse((await api.post('/products', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  await delay(3);
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/products');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/products?startDate=${startDate}&endDate=${endDate}`);
  }

  return ProductsSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Product['id']; formData: ProductForm }) => {
  const formData = new FormData();
  const { name, salePrice, costPrice, stock, categoryId, brandId, images, newImages } = data;
  formData.append('name', name);
  formData.append('salePrice', `${salePrice}`);
  formData.append('costPrice', `${costPrice}`);
  formData.append('stock', `${stock}`);
  if (categoryId) formData.append('categoryId', `${categoryId}`);
  if (brandId) formData.append('brandId', `${brandId}`);
  if (images) formData.append('oldImages', JSON.stringify(images));
  if (newImages) {
    newImages.forEach((image) => {
      formData.append('images', image);
    });
  }

  try {
    return ProductSchema.parse((await api.patch(`/products/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Product['id'] }) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
