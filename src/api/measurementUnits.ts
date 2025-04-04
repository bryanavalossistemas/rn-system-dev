import api from '@/config/axios';
import { MeasurementUnitsSchema, MeasurementUnitSchema, MeasurementUnitForm } from '@/schemas/measurementUnits';
import { isAxiosError } from 'axios';

export const create = async ({ formData }: { formData: MeasurementUnitForm }) => {
  try {
    return MeasurementUnitSchema.parse((await api.post('/measurement-units', formData)).data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const findAll = async () => {
  return MeasurementUnitsSchema.parse((await api.get('/measurement-units')).data);
};
