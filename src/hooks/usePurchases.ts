import { findAll } from '@/api/purchases';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const usePurchases = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['purchases'] : ['purchases', date],
    queryFn: () => findAll(date),
  });
};
