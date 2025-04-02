import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { BrandsSchema, Brand, BrandSchema, BrandForm } from '@/schemas/brands';
import { isAxiosError } from 'axios';

export const create = async ({ formData }: { formData: BrandForm }) => {
  try {
    return BrandSchema.parse((await api.post('/brands', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/brands');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/brands?startDate=${startDate}&endDate=${endDate}`);
  }

  return BrandsSchema.parse(res.data);
};

export const update = async ({ id, formData }: { id: Brand['id']; formData: BrandForm }) => {
  try {
    return BrandSchema.parse((await api.patch(`/brands/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Brand['id'] }) => {
  try {
    await api.delete(`/brands/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
