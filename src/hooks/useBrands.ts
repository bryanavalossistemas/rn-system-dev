import { findAll } from '@/api/brands';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useBrands = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['brands'] : ['brands', date],
    queryFn: () => findAll(date),
  });
};
