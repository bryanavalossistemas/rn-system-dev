import RegisterForm from '@/components/auth/RegisterForm';
import AuthHeader from '@/components/auth/AuthHeader';

export default function RegisterView() {
  return (
    <div className="grid gap-6">
      <AuthHeader title="Regístrate ➡️ R&N System" description="Ingrese sus credenciales a continuación para registrar tu cuenta" />
      <RegisterForm />
    </div>
  );
}
