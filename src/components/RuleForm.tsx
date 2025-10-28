"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AturanType } from "@/lib/ruleService";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import "../styles/gejala.css";

type Props = {
  initialData: AturanType | null;
  onSave: (data: AturanType) => void;
  onClose: () => void;
};

// 🔢 Generate ID Otomatis
const getLatestId = async (
  colName: string,
  prefix: string
): Promise<string> => {
  const q = query(
    collection(db, colName),
    orderBy(
      prefix === "R"
        ? "id_aturan"
        : prefix === "G"
        ? "id_gejala"
        : prefix === "D"
        ? "id_diagnosis"
        : "id_kategori"
    )
  );
  const snapshot = await getDocs(q);
  const ids = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      const field =
        prefix === "R"
          ? data.id_aturan
          : prefix === "G"
          ? data.id_gejala
          : prefix === "D"
          ? data.id_diagnosis
          : data.id_kategori;
      return typeof field === "string" && field.startsWith(prefix)
        ? parseInt(field.replace(prefix, ""), 10)
        : null;
    })
    .filter((v) => v !== null)
    .sort((a, b) => (a ?? 0) - (b ?? 0));
  const latest = ids.length > 0 ? ids[ids.length - 1]! : 0;
  return `${prefix}${(latest + 1).toString().padStart(2, "0")}`;
};

// 🔢 Ambil Urutan Prioritas Terakhir
const getLatestPrioritas = async (): Promise<number> => {
  const q = query(collection(db, "aturan"));
  const snapshot = await getDocs(q);
  const all = snapshot.docs
    .map((doc) => doc.data().urutan_prioritas)
    .filter((v) => typeof v === "number")
    .sort((a, b) => a - b);
  return all.length > 0 ? all[all.length - 1] + 1 : 1;
};

export default function RuleForm({ initialData, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<AturanType>({
    id: initialData?.id || undefined,
    id_aturan: initialData?.id_aturan || "",
    konklusi: initialData?.konklusi || "",
    premis: initialData?.premis || [],
    urutan_prioritas: initialData?.urutan_prioritas || 1,
  });

  const [gejalaDeskripsi, setGejalaDeskripsi] = useState("");
  const [gejalaId, setGejalaId] = useState("");
  const [perawatanText, setPerawatanText] = useState("");
  const [diagnosisNama, setDiagnosisNama] = useState("");

  // ========== Prefill saat edit atau generate baru ==========
  useEffect(() => {
    if (!initialData) {
      // Mode tambah baru
      getLatestId("aturan", "R").then((newId) =>
        setFormData((prev) => ({ ...prev, id_aturan: newId }))
      );
      getLatestId("gejala", "G").then((newId) => setGejalaId(newId));
      getLatestPrioritas().then((prio) =>
        setFormData((prev) => ({ ...prev, urutan_prioritas: prio }))
      );
    } else {
      // Mode edit — ambil data lengkap berdasarkan konklusi (id diagnosis)
      setFormData(initialData);
      const gejalaIdFromRule = initialData.premis?.[0];
      if (gejalaIdFromRule) setGejalaId(gejalaIdFromRule);

      // Ambil data Gejala & Diagnosis
      (async () => {
        // Gejala
        const gq = query(
          collection(db, "gejala"),
          where("id_gejala", "==", gejalaIdFromRule)
        );
        const gSnap = await getDocs(gq);
        if (!gSnap.empty) {
          setGejalaDeskripsi(gSnap.docs[0].data().deskripsi);
        }

        // Diagnosis
        const dq = query(
          collection(db, "diagnosis"),
          where("id_diagnosis", "==", initialData.konklusi)
        );
        const dSnap = await getDocs(dq);
        if (!dSnap.empty) {
          const d = dSnap.docs[0].data();
          setDiagnosisNama(d.nama);
          setPerawatanText(d.perawatan.join(", "));
        }
      })();
    }
  }, [initialData]);

  // ======================= Submit =======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gejalaDeskripsi || !diagnosisNama) {
      alert("Lengkapi deskripsi gejala dan diagnosis terlebih dahulu!");
      return;
    }

    const isEdit = Boolean(initialData);
    const kategoriPenyakit = [
      { id_kategori: "P01", nama_kategori: "Gingivitis" },
      { id_kategori: "P02", nama_kategori: "Periodontitis" },
      { id_kategori: "P03", nama_kategori: "Gangguan Gingiva Non-inflamasi" },
      { id_kategori: "P04", nama_kategori: "Lesi/Benjolan Gingiva" },
      { id_kategori: "P05", nama_kategori: "Trauma Mekanis" },
    ];
    const foundKategori =
      kategoriPenyakit.find((k) =>
        diagnosisNama.toLowerCase().includes(k.nama_kategori.toLowerCase())
      ) || kategoriPenyakit[0];

    const perawatanArr = perawatanText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (isEdit) {
      // ======== MODE EDIT ========
      const gejalaQ = query(
        collection(db, "gejala"),
        where("id_gejala", "==", gejalaId)
      );
      const gSnap = await getDocs(gejalaQ);
      if (!gSnap.empty) {
        await updateDoc(gSnap.docs[0].ref, { deskripsi: gejalaDeskripsi });
      }

      const diagQ = query(
        collection(db, "diagnosis"),
        where("id_diagnosis", "==", formData.konklusi)
      );
      const dSnap = await getDocs(diagQ);
      if (!dSnap.empty) {
        await updateDoc(dSnap.docs[0].ref, {
          nama: diagnosisNama,
          id_kategori_utama: foundKategori.id_kategori,
          perawatan: perawatanArr,
        });
      }

      const aturanQ = query(
        collection(db, "aturan"),
        where("id_aturan", "==", formData.id_aturan)
      );
      const aSnap = await getDocs(aturanQ);
      if (!aSnap.empty) {
        await updateDoc(aSnap.docs[0].ref, {
          konklusi: formData.konklusi, // tetap ID diagnosis
          premis: [gejalaId],
          urutan_prioritas: formData.urutan_prioritas,
        });
      }

      alert(`Aturan ${formData.id_aturan} berhasil diperbarui!`);
    } else {
      // ======== MODE TAMBAH ========
      await addDoc(collection(db, "gejala"), {
        id_gejala: gejalaId,
        deskripsi: gejalaDeskripsi,
      });

      const id_diagnosis = await getLatestId("diagnosis", "D");
      await addDoc(collection(db, "diagnosis"), {
        id_diagnosis,
        id_kategori_utama: foundKategori.id_kategori,
        nama: diagnosisNama,
        perawatan: perawatanArr,
      });

      await addDoc(collection(db, "aturan"), {
        id_aturan: formData.id_aturan,
        konklusi: id_diagnosis, // simpan ID diagnosis
        premis: [gejalaId],
        urutan_prioritas: formData.urutan_prioritas,
      });

      alert(`Aturan ${formData.id_aturan} berhasil ditambahkan!`);
    }

    onClose();
  };

  // ======================= FORM =======================
  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white">
            {initialData ? "Edit Aturan" : "Tambah Aturan Baru"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label">ID Aturan</label>
            <input
              type="text"
              className="form-input bg-gray-800 text-gray-400"
              value={formData.id_aturan}
              disabled
            />
          </div>

          <div>
            <label className="form-label">ID Gejala</label>
            <input
              type="text"
              className="form-input bg-gray-800 text-gray-400"
              value={gejalaId}
              disabled
            />
          </div>

          <div>
            <label className="form-label">Deskripsi Gejala</label>
            <textarea
              className="form-textarea"
              placeholder="Masukkan deskripsi gejala"
              value={gejalaDeskripsi}
              onChange={(e) => setGejalaDeskripsi(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="form-label">Diagnosis (Konklusi)</label>
            <textarea
              className="form-textarea"
              placeholder="Masukkan diagnosis"
              value={diagnosisNama}
              onChange={(e) => setDiagnosisNama(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="form-label">Perawatan</label>
            <textarea
              className="form-textarea"
              placeholder="Pisahkan dengan koma"
              value={perawatanText}
              onChange={(e) => setPerawatanText(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="form-label">Urutan Prioritas</label>
            <input
              type="number"
              min={1}
              className="form-input"
              value={formData.urutan_prioritas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  urutan_prioritas: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button type="button" onClick={onClose} className="form-btn-cancel">
              Batal
            </button>
            <button type="submit" className="form-btn-save">
              {initialData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
