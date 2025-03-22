import LoginForm from '@/components/auth/LoginForm';
import AuthHeader from '@/components/auth/AuthHeader';

export default function LoginView() {
  return (
    <div className="grid gap-6">
      <AuthHeader title="Ingresa ➡️ R&N System" description="Ingrese sus credenciales a continuación para ingresar con su cuenta" />
      <LoginForm />
    </div>
  );
}
