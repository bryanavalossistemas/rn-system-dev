import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import AuthHeader from '@/components/auth/AuthHeader';

export default function ForgotPasswordView() {
  return (
    <>
      <div className="grid gap-6">
        <AuthHeader title="Olvidé ➡️ R&N System" description="Ingrese su correo a continuación para recuperar su cuenta" />
        <ForgotPasswordForm />
      </div>
    </>
  );
}
