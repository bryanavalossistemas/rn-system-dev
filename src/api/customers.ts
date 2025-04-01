import api from '@/config/axios';
import { delay, getDateRange } from '@/lib/utils';
import { CustomerForm, Customer, CustomerSchema, CustomersSchema } from '@/schemas/customers';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: CustomerForm }) => {
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
    return CustomerSchema.parse((await api.post('/customers', formData)).data);
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
    res = await api.get('/customers');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/customers?startDate=${startDate}&endDate=${endDate}`);
  }

  return CustomersSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Customer['id']; formData: CustomerForm }) => {
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
    return CustomerSchema.parse((await api.patch(`/customers/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Customer['id'] }) => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
