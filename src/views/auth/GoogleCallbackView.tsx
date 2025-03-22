import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { google } from '@/api/auth';
import { toast } from 'sonner';
import useStore from '@/store';

export default function GoogleCallbackView() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const { mutate } = useMutation({
    mutationFn: google,
    onSuccess: ({ data }) => {
      toast.success('Ingreso correcto');
      login(data.access_token);
    },
    onError: () => {
      toast.error('Parece que hubo un problema al autenticarse con google');
      navigate('/auth/login');
    },
  });

  useEffect(() => {
    if (code) {
      mutate(code);
    } else {
      queueMicrotask(() => {
        toast.error('Parece que hubo un problema al autenticarse con Google');
      });
      navigate('/auth/login');
    }
  }, [code, mutate, navigate]);

  return <div>Procesando autenticación con Google...</div>;
}
