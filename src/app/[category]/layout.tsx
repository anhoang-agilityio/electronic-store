import { AppBreadcrumb } from '@/components/layout/breadcrumb';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="py-10 hidden md:block">
        <AppBreadcrumb />
      </div>
      {children}
    </div>
  );
}
