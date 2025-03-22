import { Outlet } from 'react-router';

export default function AppLayout() {
  return (
    <>
      <h1>Desde store layout</h1>
      <Outlet />
    </>
  );
}
