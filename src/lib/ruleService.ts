import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../styles/gejala.css";

// ====== Type untuk 3 koleksi ======
export type AturanType = {
  id?: string;
  id_aturan: string;
  konklusi: string;
  premis: string[];
  urutan_prioritas: number;
};

export type DiagnosisType = {
  id?: string;
  id_diagnosis: string;
  id_kategori_utama: string;
  nama: string;
  perawatan: string[];
};

export type GejalaType = {
  id?: string;
  id_gejala: string;
  deskripsi: string;
};

// ====== Fetch semua data ======
export const fetchAllData = async () => {
  const [aturanSnap, diagnosisSnap, gejalaSnap] = await Promise.all([
    getDocs(collection(db, "aturan")),
    getDocs(collection(db, "diagnosis")),
    getDocs(collection(db, "gejala")),
  ]);

  const aturanData = aturanSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as AturanType[];

  const diagnosisData = diagnosisSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DiagnosisType[];

  const gejalaData = gejalaSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as GejalaType[];

  return { aturanData, diagnosisData, gejalaData };
};

// ====== Simpan / Update Aturan ======
export const saveAturan = async (data: AturanType) => {
  if (data.id) {
    // update
    const ref = doc(db, "aturan", data.id);
    await updateDoc(ref, {
      id_aturan: data.id_aturan,
      konklusi: data.konklusi,
      premis: data.premis,
      urutan_prioritas: data.urutan_prioritas,
    });
  } else {
    // tambah baru
    await addDoc(collection(db, "aturan"), {
      id_aturan: data.id_aturan,
      konklusi: data.konklusi,
      premis: data.premis,
      urutan_prioritas: data.urutan_prioritas,
    });
  }
};

// ====== Hapus Aturan ======
export const deleteAturan = async (id: string) => {
  await deleteDoc(doc(db, "aturan", id));
};
