import api from '@/config/axios';
import { SupplierForm, Supplier, SupplierSchema, SuppliersSchema } from '@/schemas/suppliers';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: SupplierForm }) => {
  const { name, type, document, address, phone, email } = data;
  const formData = {
    name: name,
    type: type,
    document: document,
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

export const findAll = async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  let res;

  if (startDate && endDate) {
    res = await api.get(`/suppliers?startDate=${startDate}&endDate=${endDate}`);
  } else {
    res = await api.get('/suppliers');
  }

  return SuppliersSchema.parse(res.data);
};

export const findOne = async ({ id }: { id: Supplier['id'] }) => {
  return SupplierSchema.parse((await api.get(`/suppliers/${id}`)).data);
};

export const update = async ({ id, formData: data }: { id: Supplier['id']; formData: SupplierForm }) => {
  const { name, type, document, address, phone, email } = data;
  const formData = {
    name: name,
    type: type,
    document: document,
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
