import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-20 md:px-8 md:pb-6 lg:px-10">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
