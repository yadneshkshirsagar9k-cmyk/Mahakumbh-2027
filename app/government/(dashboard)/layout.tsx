import GovernmentSidebar from '@/components/government/layout/GovernmentSidebar';
import TopCommandBar from '@/components/government/layout/TopCommandBar';

export default function GovernmentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <GovernmentSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopCommandBar />

        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
