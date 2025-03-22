import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="min-h-svh grid sm:grid-cols-2">
      <main className="px-2 max-w-xs place-self-center">
        <Outlet />
      </main>
      <div className="hidden sm:block relative">
        <img
          src="https://motionbgs.com/media/1405/goku-beast-mode.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
