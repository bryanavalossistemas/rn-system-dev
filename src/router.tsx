import { BrowserRouter, Route, Routes } from 'react-router';
import AuthLayout from '@/layouts/AuthLayout';
import LoginView from '@/views/auth/LoginView';
import RegisterView from '@/views/auth/RegisterView';
import GoogleCallbackView from '@/views/auth/GoogleCallbackView';
import DashboardLayout from '@/layouts/DashboardLayout';
import VerifyEmailview from '@/views/auth/VerifyEmailview';
import ForgotPasswordView from '@/views/auth/ForgotPasswordView';
import ResetPasswordView from '@/views/auth/ResetPasswordView';
import AuthenticatedRoutes from '@/middlewares/AuthenticatedRoutes';
import HomeView from '@/views/HomeView';
import AuthorizedRoutes from '@/middlewares/AuthorizedRoutes';
import AppLayout from '@/layouts/AppLayout';
import DashboardView from '@/views/admin/dashboard/DashboardView';
import RedirectIfAuthenticated from '@/middlewares/RedirectIfAuthenticated';
import CategoriesView from '@/views/admin/dashboard/CategoriesView';
import ProductsView from '@/views/admin/dashboard/ProductsView';
import BrandsView from '@/views/admin/dashboard/BrandsView';
import SuppliersView from '@/views/admin/dashboard/SuppliersView';
import PurchasesView from '@/views/admin/dashboard/PurchasesView';
import POSView from '@/views/admin/dashboard/POSView';
import CustomersView from '@/views/admin/dashboard/CustomersView';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PROTEGIDAS CON AUTENTICACION */}
        <Route element={<AuthenticatedRoutes />}>
          {/* RUTAS DE ADMINISTRADOR */}
          <Route element={<AuthorizedRoutes allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<DashboardView />} />
              <Route path="/admin/dashboard/inventory/categories" element={<CategoriesView />} />
              <Route path="/admin/dashboard/inventory/brands" element={<BrandsView />} />
              <Route path="/admin/dashboard/inventory/products" element={<ProductsView />} />
              <Route path="/admin/dashboard/purchases/suppliers" element={<SuppliersView />} />
              <Route path="/admin/dashboard/purchases/purchases" element={<PurchasesView />} />
              <Route path="/admin/dashboard/sales/customers" element={<CustomersView />} />
              <Route path="/admin/dashboard/sales/pos" element={<POSView />} />
            </Route>
          </Route>

          {/* RUTAS DE USUARIO */}
          <Route element={<AuthorizedRoutes allowedRoles={['admin', 'user']} />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomeView />} />
            </Route>
          </Route>
        </Route>

        {/* RUTAS PUBLICAS */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth/register" element={<RegisterView />} />
            <Route path="/auth/verify-email" element={<VerifyEmailview />} />
            <Route path="/auth/login" element={<LoginView />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
            <Route path="/auth/reset-password" element={<ResetPasswordView />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
