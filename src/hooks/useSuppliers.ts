import { findAll } from '@/api/suppliers';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useSuppliers = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['suppliers'] : ['suppliers', date],
    queryFn: () => findAll(date),
  });
};
