import * as React from 'react';
import { Boxes, MonitorCog, ShoppingCartIcon, Store } from 'lucide-react';
import { NavMain } from '@/components/admin/dashboard/NavMain';
import { NavUser } from '@/components/admin/dashboard/NavUser';
import { TeamSwitcher } from '@/components/admin/dashboard/TeamSwitcher';
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
            title: 'Documentos',
            url: '/admin/dashboard/purchases/documents',
            isActive: pathname === '/admin/dashboard/purchases/documents',
          },
          {
            title: 'Proveedores',
            url: '/admin/dashboard/purchases/suppliers',
            isActive: pathname === '/admin/dashboard/purchases/suppliers',
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
