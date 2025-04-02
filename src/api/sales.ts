import api from '@/config/axios';
import { delay, getDateRange } from '@/lib/utils';
import { Sale, SaleForm, SaleSchema, SalesSchema } from '@/schemas/sales';
import { isAxiosError } from 'axios';

export const create = async ({ formData: data }: { formData: SaleForm }) => {
  const { documentType, customerId, saleDetails } = data;

  const formData = {
    documentType: documentType,
    customerId: customerId,
    saleDetails: saleDetails.map((d) => {
      return {
        productId: d.productId,
        productName: d.productName,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
      };
    }),
  };

  try {
    return SaleSchema.parse((await api.post('/sales', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async (date?: string | null) => {
  let res;

  if (date === null || date === undefined) {
    res = await api.get('/sales');
  } else {
    const { startDate, endDate } = getDateRange(date);
    res = await api.get(`/sales?startDate=${startDate}&endDate=${endDate}`);
  }

  return SalesSchema.parse(res.data);
};

export const update = async ({ id, formData: data }: { id: Sale['id']; formData: SaleForm }) => {
  const { documentType, customerId, saleDetails } = data;
  const formData = {
    documentType: documentType,
    customerId: customerId,
    saleDetails: saleDetails.map((d) => {
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
    return SaleSchema.parse((await api.patch(`/sales/${id}`, formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const remove = async ({ id }: { id: Sale['id'] }) => {
  try {
    await api.delete(`/sales/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
