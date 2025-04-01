import { findAll } from '@/api/sales';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useSales = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['sales'] : ['sales', date],
    queryFn: () => findAll(date),
  });
};
