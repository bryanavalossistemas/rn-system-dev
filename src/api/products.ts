import api from '@/config/axios';
import { ProductSchema, ProductsSchema, Product, ProductForm } from '@/schemas/products';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: ProductForm }) => {
  const formData = new FormData();
  const { name, salePrice, costPrice, stock, categoryId, brandId, images } = data;
  formData.append('name', name);
  formData.append('salePrice', `${salePrice}`);
  formData.append('costPrice', `${costPrice}`);
  formData.append('stock', `${stock}`);
  if (categoryId) formData.append('categoryId', `${categoryId}`);
  if (brandId) formData.append('brandId', `${brandId}`);
  if (images) {
    images.forEach((image) => {
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

export const findAll = async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  let res;

  if (startDate && endDate) {
    res = await api.get(`/products?startDate=${startDate}&endDate=${endDate}`);
  } else {
    res = await api.get('/products');
  }

  return ProductsSchema.parse(res.data);
};

export const findOne = async (id: Product['id']) => {
  return ProductSchema.parse((await api.get(`/products/${id}`)).data);
};

export const update = async ({ id, formData: data }: { id: Product['id']; formData: ProductForm }) => {
  const formData = new FormData();
  const { name, salePrice, costPrice, stock, categoryId, brandId, images, oldImages } = data;
  formData.append('name', name);
  formData.append('salePrice', `${salePrice}`);
  formData.append('costPrice', `${costPrice}`);
  formData.append('stock', `${stock}`);
  if (categoryId) formData.append('categoryId', `${categoryId}`);
  if (brandId) formData.append('brandId', `${brandId}`);
  if (oldImages) formData.append('oldImages', JSON.stringify(oldImages));
  if (images) {
    images.forEach((image) => {
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
