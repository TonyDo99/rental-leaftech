import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <main className="md:pl-64">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
