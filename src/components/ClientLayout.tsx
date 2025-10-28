"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return !isLoginPage ? (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-8 bg-[#11131a] flex-1 overflow-y-auto rounded-tl-2xl shadow-inner">
          {children}
        </main>
      </div>
    </div>
  ) : (
    children
  );
}
