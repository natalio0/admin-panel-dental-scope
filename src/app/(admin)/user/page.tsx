"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Edit, Trash, X } from "lucide-react";
import "../../../styles/user.css";

// ==========================
// Tipe Data User
// ==========================
type UserType = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

interface UserFormProps {
  initialData: UserType | null;
  onSave: (user: UserType) => Promise<void>;
  onClose: () => void;
}

// ==========================
// Komponen Modal Form User
// ==========================
const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [name, setname] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState<UserType["role"]>(
    initialData?.role || "user"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSaving(true);
    await onSave({
      id: initialData?.id || "",
      name,
      email,
      role,
    });
    setIsSaving(false);
  };

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? "Edit User" : "Tambah User"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserType["role"])}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="user-modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="user-btn-cancel"
              disabled={isSaving}
            >
              Batal
            </button>
            <button type="submit" className="user-btn-save" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================
// Halaman Kelola User
// ==========================
export default function UserPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data: UserType[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<UserType, "id">),
        id: doc.id,
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (user: UserType) => {
    try {
      const { id, ...data } = user;
      if (editingUser) {
        await updateDoc(doc(db, "users", id), data);
      } else {
        const newDocRef = doc(collection(db, "users"));
        await setDoc(newDocRef, data);
      }
      await fetchUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Gagal menyimpan data user.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Gagal menghapus user.");
      }
    }
  };

  return (
    <div className="user-page">
      {/* HEADER */}
      <div className="user-header">
        <h3>Kelola User</h3>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="user-button-add"
        >
          <Plus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="text-center py-10 text-indigo-400">
          Memuat data user...
        </div>
      ) : (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                        className="user-action-btn user-btn-edit"
                        title="Ubah"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="user-action-btn user-btn-delete"
                        title="Hapus"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <UserForm
          initialData={editingUser}
          onSave={handleSaveUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
