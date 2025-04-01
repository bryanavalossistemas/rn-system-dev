import api from '@/config/axios';
import { delay } from '@/lib/utils';
import { SaleForm, SaleSchema } from '@/schemas/sales';
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

  await delay(3);

  try {
    return SaleSchema.parse((await api.post('/sales', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
