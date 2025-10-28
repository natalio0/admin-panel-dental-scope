"use client";
import { useState, useEffect } from "react";
import "../styles/header.css";
import { Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type NotificationType = {
  id: string;
  message: string;
  timestamp: any;
};

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Cek login user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Ambil notifikasi
  useEffect(() => {
    if (!user) return;
    const notifQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(notifQuery, (snapshot) => {
      const fetched: NotificationType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<NotificationType, "id">),
      }));
      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleNotif = () => {
    setIsNotifOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotifOpen(false);
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // redirect ke login
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "A";
  const userName = user?.displayName || user?.email || "Admin";

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">
          <span className="title-system">Deteksi Dini Penyakit Gusi</span>{" "}
          <span className="title-panel">| Panel Admin</span>
        </h1>
      </div>

      <div className="header-right">
        {/* Notifikasi */}
        <div className="notif-section">
          <button className="notif-button" onClick={toggleNotif}>
            <Bell size={20} />
            {notifications.length > 0 && <span className="notif-dot"></span>}
          </button>

          {isNotifOpen && (
            <div className="dropdown notif-dropdown">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <p key={n.id} className="notif-item">
                    {n.message}
                  </p>
                ))
              ) : (
                <p className="notif-empty">Tidak ada notifikasi baru</p>
              )}
            </div>
          )}
        </div>

        {/* Profil */}
        <div className="profile-section">
          <button className="profile-button" onClick={toggleProfile}>
            <div className="avatar">{userInitials}</div>
            <span className="username">{userName}</span>
            <ChevronDown size={16} />
          </button>

          {isProfileOpen && (
            <div className="dropdown profile-dropdown">
              <button className="logout" onClick={handleLogout}>
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
