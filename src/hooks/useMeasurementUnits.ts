import { findAll } from '@/api/measurementUnits';
import { useQuery } from '@tanstack/react-query';

export const useMeasurementUnits = () => {
  return useQuery({
    queryKey: ['measurementUnits'],
    queryFn: () => findAll(),
  });
};
