import { Button } from '@/components/ui/button';
import api from '@/config/axios';
import useStore from '@/store';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function HomeView() {
  const mandarPeticion = async () => {
    const res = await api.get('/auth/me');
    console.log(res);
  };

  const { user, logout } = useStore();

  return (
    <>
      <h1>
        Uste a iniciado sesion correctamente con el email: {user?.email} y tiene los roles de: {JSON.stringify(user?.roles)}
      </h1>
      <Button onClick={() => mandarPeticion()}>Manda peticion con jwt</Button>
      <Button asChild>
        <Link to="/auth/login">Ir al login</Link>
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          logout();
          toast.success('Deslogueo correcto');
        }}
      >
        CERRAR SESION
      </Button>
    </>
  );
}
