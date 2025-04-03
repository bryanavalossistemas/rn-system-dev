import * as React from 'react';
import { Boxes, MonitorCog, PiggyBankIcon, ShoppingCartIcon, Store } from 'lucide-react';
import { NavMain } from '@/components/admin/dashboard/ui/NavMain';
import { NavUser } from '@/components/admin/dashboard/ui/NavUser';
import { TeamSwitcher } from '@/components/admin/dashboard/ui/TeamSwitcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useLocation } from 'react-router';

export default function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useLocation().pathname;

  const data = {
    user: {
      name: 'Alicia Loa y Pardo',
      email: 'representacionesnataly@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Tienda',
        logo: Store,
        plan: 'Enterprise',
      },
      {
        name: 'Sistema',
        logo: MonitorCog,
        plan: 'Startup',
      },
    ],
    navMain: [
      // INVENTARIO
      {
        title: 'Inventario',
        icon: Boxes,
        isActive: pathname.includes('/admin/dashboard/inventory'),
        items: [
          {
            title: 'Productos',
            url: '/admin/dashboard/inventory/products',
            isActive: pathname === '/admin/dashboard/inventory/products',
          },
          {
            title: 'Categorías',
            url: '/admin/dashboard/inventory/categories',
            isActive: pathname === '/admin/dashboard/inventory/categories',
          },
          {
            title: 'Marcas',
            url: '/admin/dashboard/inventory/brands',
            isActive: pathname === '/admin/dashboard/inventory/brands',
          },
        ],
      },

      // COMPRAS
      {
        title: 'Compras',
        icon: ShoppingCartIcon,
        isActive: pathname.includes('/admin/dashboard/purchases'),
        items: [
          {
            title: 'Compras',
            url: '/admin/dashboard/purchases/purchases',
            isActive: pathname === '/admin/dashboard/purchases/purchases',
          },
          {
            title: 'Proveedores',
            url: '/admin/dashboard/purchases/suppliers',
            isActive: pathname === '/admin/dashboard/purchases/suppliers',
          },
        ],
      },

      // VENTAS
      {
        title: 'Ventas',
        icon: PiggyBankIcon,
        isActive: pathname.includes('/admin/dashboard/sales'),
        items: [
          {
            title: 'Ventas',
            url: '/admin/dashboard/sales/sales',
            isActive: pathname === '/admin/dashboard/sales/sales',
          },
          {
            title: 'Punto de Venta',
            url: '/admin/dashboard/sales/pos',
            isActive: pathname === '/admin/dashboard/sales/pos',
          },
          {
            title: 'Clientes',
            url: '/admin/dashboard/sales/customers',
            isActive: pathname === '/admin/dashboard/sales/customers',
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
