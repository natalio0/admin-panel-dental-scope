"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 1. Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 🔹 2. Update nama pengguna
      await updateProfile(user, { displayName: name });

      // 🔹 3. Simpan data ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      // 🔹 4. Logout paksa agar tidak langsung diarahkan ke dashboard
      await signOut(auth);

      // 🔹 5. Redirect dengan sedikit delay agar auth state benar-benar sync
      toast.success("Registrasi berhasil! Silakan login untuk melanjutkan.");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.error(err);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          toast.error("Email sudah digunakan.");
        } else if (err.code === "auth/weak-password") {
          toast.error("Password terlalu lemah (min. 6 karakter).");
        } else {
          toast.error("Terjadi kesalahan. Coba lagi.");
        }
      } else {
        toast.error("Kesalahan tak terduga.");
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
            Daftar Admin / Super Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Buat akun baru untuk mengakses panel sistem pakar
          </p>
        </div>

        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="input-glass"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <select
            className="input-glass bg-[#1a1d26] text-gray-200"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="super-admin">Super Admin</option>
          </select>

          <button
            type="button"
            onClick={handleRegister}
            className="btn-glow mt-2"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
