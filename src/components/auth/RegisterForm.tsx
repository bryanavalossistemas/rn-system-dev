import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/auth';
import { toast } from 'sonner';
import GoogleButton from '@/components/auth/GoogleButton';
import { RegisterForm as RegisterFormType, RegisterFormSchema } from '@/schemas/auth';
import { Link } from 'react-router';

export default function RegisterForm() {
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Revise su correo y siga las instrucciones');
      form.reset();
    },
    onError: () => {
      toast.error('Parece que hubo un error al registrar su cuenta');
      form.reset();
    },
  });

  const onSubmit = (data: RegisterFormType) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
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
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-4">
          <Button type="submit" disabled={isPending}>
            Registrarse
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">O regístrate con</span>
          </div>
          <GoogleButton />
        </div>
        <div className="flex justify-center mt-3">
          <p className="text-muted-foreground text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/auth/login" className="text-foreground font-medium hover:underline">
              Ingresar
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
