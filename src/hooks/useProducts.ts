import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { findAll } from '@/api/products';

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['products'] : ['products', date],
    queryFn: () => findAll(date),
  });
};
