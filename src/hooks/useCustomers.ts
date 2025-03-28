import { findAll } from '@/api/customers';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useCustomers = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['customers'] : ['customers', date],
    queryFn: () => findAll(date),
  });
};
