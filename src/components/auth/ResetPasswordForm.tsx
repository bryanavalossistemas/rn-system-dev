import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/api/auth';
import { toast } from 'sonner';
import { ResetPasswordForm as ResetPasswordFormType, ResetPasswordFormSchema } from '@/schemas/auth';
import { Link, useNavigate } from 'react-router';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: '',
      token: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Se reestableció su contraseña correctamente');
      navigate('/auth/login');
    },
    onError: () => {
      toast.error('Parece que hubo un error al reestablecer su contraseña');
      navigate('/auth/login');
    },
  });

  const onSubmit = (data: ResetPasswordFormType) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-2.5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="justify-between items-center">Nueva contraseña</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-3 mt-4">
          <Button type="submit" disabled={isPending}>
            Reestablecer
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
