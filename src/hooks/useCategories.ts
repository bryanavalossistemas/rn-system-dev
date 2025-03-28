import { findAll } from '@/api/categories';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

export const useCategories = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  return useQuery({
    queryKey: date === null ? ['categories'] : ['categories', date],
    queryFn: () => findAll(date),
  });
};
