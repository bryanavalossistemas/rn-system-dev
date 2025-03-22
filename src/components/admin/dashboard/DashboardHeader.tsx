import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Fragment } from 'react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ThemeSelector } from '@/components/ui/theme-selector';

interface Breadcrumb {
  breadcrumbs?: {
    label: string;
    href: string;
  }[];
  page: {
    label: string;
  };
}

export default function DashboardHeader({ breadcrumb }: { breadcrumb: Breadcrumb }) {
  return (
    <header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
      <div className="flex justify-between h-12 sm:h-14 w-full items-center px-2 sm:px-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.breadcrumbs &&
                breadcrumb.breadcrumbs.map((breadcrumb) => (
                  <Fragment key={breadcrumb.href}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                ))}
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumb.page.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSelector className="hidden sm:flex w-32" />
          <ModeToggle className="w-8 h-8 dark:bg-input/30 dark:hover:bg-input/50 bg-transparent" />
        </div>
      </div>
    </header>
  );
}
