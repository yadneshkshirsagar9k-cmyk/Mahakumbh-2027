import AdminSidebar from '@/components/government/administration/AdminSidebar';

export default function CitizenServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#0a0f18] -m-8">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
