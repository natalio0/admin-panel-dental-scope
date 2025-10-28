"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 1. Login ke Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 🔹 2. Ambil data role dari Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        // 🔹 3. Validasi role
        if (data.role === "admin" || data.role === "super-admin") {
          toast.success(`Selamat datang, ${data.role}!`);
          router.push("/home");
        } else {
          toast.error("Akses ditolak — role tidak valid.");
          await auth.signOut();
        }
      } else {
        toast.error("Data pengguna tidak ditemukan di database.");
        await auth.signOut();
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.error(err.code, err.message);
        if (
          ["auth/invalid-credential", "auth/wrong-password"].includes(err.code)
        ) {
          toast.error("Email atau password salah.");
        } else if (err.code === "auth/user-not-found") {
          toast.error("Akun tidak ditemukan. Silakan daftar dulu.");
        } else {
          toast.error("Terjadi kesalahan, coba lagi.");
        }
      } else {
        console.error(err);
        toast.error("Terjadi kesalahan tak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted)
    return (
      <div className="center-wrapper text-gray-100">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="center-wrapper fade-in px-6" suppressHydrationWarning>
      <div className="card-login">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/login.png"
            alt="Logo"
            width={100}
            height={100}
            priority
            className="mb-4 drop-shadow-lg"
          />
          <h1 className="text-2xl font-semibold text-white text-center">
            Panel Admin Sistem Pakar Gusi
          </h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Masuk untuk mengelola data sistem pakar
          </p>
        </div>

        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email"
            className="input-glass"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-glass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={handleLogin}
            className="btn-glow mt-2"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
}
