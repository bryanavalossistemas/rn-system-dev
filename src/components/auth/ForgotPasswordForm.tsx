import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/api/auth';
import { toast } from 'sonner';
import { ForgotForm as ForgotFormType, ForgotFormSchema } from '@/schemas/auth';
import { Link } from 'react-router';

export default function ForgotPasswordForm() {
  const form = useForm<ForgotFormType>({
    resolver: zodResolver(ForgotFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('Revise su correo y siga las instrucciones');
      form.reset();
    },
    onError: () => {
      toast.error('Parece que hubo un error al recuperar su cuenta');
      form.reset();
    },
  });

  const onSubmit = (data: ForgotFormType) => {
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
        </div>
        <div className="flex flex-col gap-y-3 mt-4">
          <Button type="submit" disabled={isPending}>
            Recuperar
          </Button>
        </div>
        <div className="flex justify-center mt-3">
          <p className="text-muted-foreground text-sm">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/auth/login" className="text-foreground font-medium hover:underline">
              Ingresar
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
