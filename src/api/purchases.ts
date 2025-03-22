import api from '@/config/axios';
import { delay } from '@/lib/utils';
import { PurchaseForm, Purchase, PurchaseSchema, PurchasesSchema } from '@/schemas/purchases';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: PurchaseForm }) => {
  const { documentTypeId, supplierId, documentDetails } = data;
  const formData = {
    documentTypeId: parseInt(documentTypeId),
    supplierId: parseInt(supplierId),
    documentDetails: documentDetails.map((d) => {
      return {
        productId: parseInt(d.productId),
        quantity: parseInt(d.quantity),
        unitPrice: parseFloat(d.unitPrice),
      };
    }),
  };

  await delay(3);

  try {
    return PurchaseSchema.parse((await api.post('/purchases', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
  let res;

  if (startDate && endDate) {
    res = await api.get(`/purchases?startDate=${startDate}&endDate=${endDate}`);
  } else {
    res = await api.get('/purchases');
  }

  return PurchasesSchema.parse(res.data);
};

export const findOne = async ({ id }: { id: Purchase['id'] }) => {
  return PurchaseSchema.parse((await api.get(`/purchases/${id}`)).data);
};

export const update = async ({ id, formData: data }: { id: Purchase['id']; formData: PurchaseForm }) => {
  const { documentTypeId, supplierId, documentDetails } = data;
  const formData = {
    documentTypeId: parseInt(documentTypeId),
    supplierId: parseInt(supplierId),
    documentDetails: documentDetails.map((d) => {
      return {
        id: d.id,
        productId: parseInt(d.productId),
        quantity: parseInt(d.quantity),
        unitPrice: parseFloat(d.unitPrice),
        deleted: d.deleted,
      };
    }),
  };

  await delay(3);

  try {
    return PurchaseSchema.parse((await api.patch(`/purchases/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Purchase['id'] }) => {
  await delay(3);

  try {
    await api.delete(`/purchases/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
