import api from '@/config/axios';
import { getDateRange } from '@/lib/utils';
import { PurchaseForm, Purchase, PurchaseSchema, PurchasesSchema } from '@/schemas/purchases';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: PurchaseForm }) => {
  const { documentType, supplierId, purchaseDetails } = data;
  const formData = {
    documentType: documentType,
    supplierId: supplierId,
    purchaseDetails: purchaseDetails.map((d) => {
      return {
        productId: d.productId,
        productName: d.productName,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
      };
    }),
  };

  try {
    return PurchaseSchema.parse((await api.post('/purchases', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/purchases');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/purchases?startDate=${startDate}&endDate=${endDate}`);
  }

  return PurchasesSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Purchase['id']; formData: PurchaseForm }) => {
  const { documentType, supplierId, purchaseDetails } = data;
  const formData = {
    documentType: documentType,
    supplierId: supplierId,
    purchaseDetails: purchaseDetails.map((d) => {
      return {
        id: d.created ? undefined : d.id,
        productId: d.productId,
        productName: d.productName,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        deleted: d.deleted,
      };
    }),
  };

  try {
    return PurchaseSchema.parse((await api.patch(`/purchases/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Purchase['id'] }) => {
  try {
    await api.delete(`/purchases/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
