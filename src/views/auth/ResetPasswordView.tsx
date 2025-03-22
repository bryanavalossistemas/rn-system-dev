import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import AuthHeader from '@/components/auth/AuthHeader';

export default function ResetPasswordView() {
  return (
    <div className="grid gap-6">
      <AuthHeader
        title="Reestablecer ➡️ R&N System"
        description="Ingrese su nueva contraseña y código de recuperación a continuación para recuperar su cuenta"
      />
      <ResetPasswordForm />
    </div>
  );
}
