"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Activity,
  Brain,
  LogOut,
  ClipboardList,
  FileText,
} from "lucide-react";
import "../styles/sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/home" },
  { name: "Kelola User", icon: Brain, path: "/user" },
  { name: "Kelola Aturan", icon: Activity, path: "/gejala" },
  { name: "Riwayat Diagnosis", icon: ClipboardList, path: "/riwayat" },
  { name: "Survey", icon: FileText, path: "/survey" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar">
      {/* Header */}
      <div>
        <h2 style={{ cursor: "pointer" }} onClick={() => router.push("/home")}>
          Dental Scope
        </h2>

        {/* Menu */}
        <nav>
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={active ? "active" : ""}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button onClick={() => router.push("/login")} className="logout">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
