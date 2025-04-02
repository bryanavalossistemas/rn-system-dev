import api from '@/config/axios';
import { delay, getDateRange } from '@/lib/utils';
import { SupplierForm, Supplier, SupplierSchema, SuppliersSchema } from '@/schemas/suppliers';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: SupplierForm }) => {
  const { name, documentType, documentNumber, address, phone, email } = data;
  const formData = {
    name: name,
    documentType: documentType,
    documentNumber: documentNumber,
    address: address || null,
    phone: phone || null,
    email: email || null,
  };

  try {
    return SupplierSchema.parse((await api.post('/suppliers', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/suppliers');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/suppliers?startDate=${startDate}&endDate=${endDate}`);
  }

  return SuppliersSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Supplier['id']; formData: SupplierForm }) => {
  const { name, documentType, documentNumber, address, phone, email } = data;
  const formData = {
    name: name,
    documentType: documentType,
    documentNumber: documentNumber,
    address: address || null,
    phone: phone || null,
    email: email || null,
  };

  try {
    return SupplierSchema.parse((await api.patch(`/suppliers/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Supplier['id'] }) => {
  try {
    await api.delete(`/suppliers/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
