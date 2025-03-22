import api from '@/config/axios';
import { BrandsSchema, Brand, BrandSchema, CreateBrandForm, UpdateBrandForm } from '@/schemas/brands';

export const create = async ({ formData }: { formData: CreateBrandForm }) => {
  return BrandSchema.parse((await api.post('/brands', formData)).data);
};

export const findAll = async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  let res;

  if (startDate && endDate) {
    res = await api.get(`/brands?startDate=${startDate}&endDate=${endDate}`);
  } else {
    res = await api.get('/brands');
  }

  return BrandsSchema.parse(res.data);
};

export const findOne = async (id: Brand['id']) => {
  return BrandSchema.parse((await api.get(`/brands/${id}`)).data);
};

export const update = async ({ id, formData }: { id: Brand['id']; formData: UpdateBrandForm }) => {
  return BrandSchema.parse((await api.patch(`/brands/${id}`, formData)).data);
};

export const remove = async ({ id }: { id: Brand['id'] }) => {
  await api.delete(`/brands/${id}`);
};
