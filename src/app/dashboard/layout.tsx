import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <Sidebar />

        <div className="flex-1 space-y-4">
          <Topbar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
