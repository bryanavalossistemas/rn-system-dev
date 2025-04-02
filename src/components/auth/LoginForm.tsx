import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { toast } from 'sonner';
import GoogleButton from '@/components/auth/GoogleButton';
import { Link } from 'react-router';
import { LoginForm as LoginFormType, LoginFormSchema } from '@/schemas/auth';
import { ComponentProps } from 'react';
import useStore from '@/store';

export default function LoginForm({ ...props }: ComponentProps<'form'>) {
  const { login: loginStore } = useStore();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: 'bryanavalossistemas@gmail.com',
      password: 'password',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      toast.success('Ingreso correcto');
      loginStore(data.access_token);
    },
    onError: () => {
      toast.error('Parece que hubo un error al ingresar con su cuenta');
      form.reset();
    },
  });

  const onSubmit = (data: LoginFormType) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <div className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="justify-between items-center">
                  Contraseña
                  <Link to="/auth/forgot-password" className="hover:underline font-medium">
                    ¿Olvidé mi contraseña?
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-y-2.5 mt-4">
          <Button type="submit" disabled={isPending}>
            Ingresar
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">O ingresa con</span>
          </div>
          <GoogleButton />
        </div>
        <div className="flex justify-center mt-3">
          <p className="text-muted-foreground text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/auth/register" className="text-foreground font-medium hover:underline">
              Registrarse
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
