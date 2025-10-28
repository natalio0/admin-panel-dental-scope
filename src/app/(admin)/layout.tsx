import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import React from "react";

const SIDEBAR_WIDTH = 250; // lebar sidebar dalam px

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0f1117] text-gray-200">
      {/* === SIDEBAR === */}
      <Sidebar />

      {/* === AREA KONTEN === */}
      <div
        className="flex-1 flex flex-col relative transition-all duration-300"
        style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}
      >
        {/* === HEADER === */}
        <Header />

        {/* === MAIN CONTENT === */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
