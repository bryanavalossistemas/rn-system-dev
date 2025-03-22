import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Token, TokenSchema } from '@/schemas/auth';
import { verifyEmail } from '@/api/auth';
import { useNavigate } from 'react-router';

export default function VerifyEmailForm() {
  const navigate = useNavigate();

  const form = useForm<Token>({
    resolver: zodResolver(TokenSchema),
    defaultValues: {
      token: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success('Su cuenta fue verificada correctamente');
      navigate('/auth/login');
    },
    onError: () => {
      toast.error('Parece que hubo un error al verificar su cuenta');
      navigate('/auth/login');
    },
  });

  const onSubmit = (data: Token) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col items-center" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
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
        <div className="mt-3">
          <Button type="submit" disabled={isPending}>
            Verificar cuenta
          </Button>
        </div>
      </form>
    </Form>
  );
}
