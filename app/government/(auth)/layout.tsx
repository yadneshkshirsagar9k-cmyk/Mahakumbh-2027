export default function GovernmentAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">GOV OPERATIONS</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Mahakumbh 2027 Portal</p>
        </div>
        {children}
      </div>
    </div>
  );
}
