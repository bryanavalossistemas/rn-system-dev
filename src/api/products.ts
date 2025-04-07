import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { ProductSchema, ProductsSchema, Product, ProductForm } from '@/schemas/products';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: ProductForm }) => {
  const formData = new FormData();
  const {
    name,
    salePrice,
    categoryId,
    brandId,
    newImages,
    barCode,
    description,
    ecommercePercentageDiscount,
    ecommerceSalePrice,
    measurementQuantity,
    measurementUnitId,
    showInEcommerce,
    sku,
  } = data;
  formData.append('name', name);
  formData.append('salePrice', `${salePrice}`);
  formData.append('description', `${description || null}`);
  formData.append('categoryId', `${categoryId || null}`);
  formData.append('brandId', `${brandId || null}`);
  formData.append('measurementUnitId', `${measurementUnitId || null}`);
  formData.append('measurementQuantity', `${measurementQuantity || null}`);
  formData.append('barCode', `${barCode || null}`);
  formData.append('sku', `${sku || null}`);
  newImages.forEach((newImage) => {
    formData.append('newImages', newImage);
  });
  formData.append('showInEcommerce', `${showInEcommerce}`);
  formData.append('ecommerceSalePrice', `${ecommerceSalePrice || null}`);
  formData.append('ecommercePercentageDiscount', `${ecommercePercentageDiscount || null}`);

  try {
    return ProductSchema.parse((await api.post('/products', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
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
  const {
    name,
    salePrice,
    categoryId,
    brandId,
    images,
    newImages,
    ecommerceSalePrice,
    barCode,
    description,
    ecommercePercentageDiscount,
    measurementQuantity,
    measurementUnitId,
    showInEcommerce,
    sku,
  } = data;
  formData.append('name', name);
  formData.append('salePrice', `${salePrice}`);
  formData.append('description', `${description || null}`);
  formData.append('categoryId', `${categoryId || null}`);
  formData.append('brandId', `${brandId || null}`);
  formData.append('barCode', `${barCode || null}`);
  formData.append('sku', `${sku || null}`);
  formData.append('measurementUnitId', `${measurementUnitId || null}`);
  formData.append('measurementQuantity', `${measurementQuantity || null}`);
  if (images.length > 0) formData.append('images', JSON.stringify(images));
  newImages.forEach((newImage) => {
    formData.append('newImages', newImage);
  });
  formData.append('showInEcommerce', `${showInEcommerce}`);
  formData.append('ecommerceSalePrice', `${ecommerceSalePrice || null}`);
  formData.append('ecommercePercentageDiscount', `${ecommercePercentageDiscount || null}`);

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
