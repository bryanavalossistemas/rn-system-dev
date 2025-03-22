import VerifyEmailForm from '@/components/auth/VerifyEmailForm';
import AuthHeader from '@/components/auth/AuthHeader';

export default function VerifyEmailview() {
  return (
    <>
      <div className="grid gap-6">
        <AuthHeader title="Verificar ➡️ R&N System" description="Ingrese su token de 6 dígitos para verificar su cuenta" />

        <VerifyEmailForm />
      </div>
    </>
  );
}
