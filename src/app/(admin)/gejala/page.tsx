"use client";
import { useState, useEffect } from "react";
import { Edit, Trash, Plus } from "lucide-react";
import RuleForm from "@/components/RuleForm";
import {
  AturanType,
  fetchAllData,
  saveAturan,
  deleteAturan,
} from "@/lib/ruleService";

export default function AdminAturanPage() {
  const [aturanList, setAturanList] = useState<AturanType[]>([]);
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [gejalaList, setGejalaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAturan, setEditingAturan] = useState<AturanType | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const { aturanData, diagnosisData, gejalaData } = await fetchAllData();
    setAturanList(aturanData);
    setDiagnosisList(diagnosisData);
    setGejalaList(gejalaData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data: AturanType) => {
    await saveAturan(data);
    await loadData();
    setIsModalOpen(false);
    setEditingAturan(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus aturan ini?")) return;
    await deleteAturan(id);
    await loadData();
  };

  return (
    <div className="user-page">
      {/* HEADER */}
      <div className="user-header">
        <h3>Kelola Aturan</h3>
        <button
          className="user-button-add"
          onClick={() => {
            setEditingAturan(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} /> Tambah Aturan
        </button>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p className="text-indigo-400 text-center py-6">Memuat data...</p>
      ) : (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID Aturan</th>
                <th>Diagnosis</th>
                <th>Premis</th>
                <th>Prioritas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {aturanList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Belum ada data aturan.
                  </td>
                </tr>
              ) : (
                aturanList.map((a) => {
                  const diag = diagnosisList.find(
                    (d) => d.id_diagnosis === a.konklusi
                  );
                  const premisDesc = a.premis
                    .map(
                      (gid) =>
                        gejalaList.find((g) => g.id_gejala === gid)?.deskripsi
                    )
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr key={a.id}>
                      <td>{a.id_aturan}</td>
                      <td>{diag?.nama || "-"}</td>
                      <td>{premisDesc}</td>
                      <td>{a.urutan_prioritas}</td>
                      <td className="text-right">
                        <button
                          className="user-action-btn user-btn-edit"
                          onClick={() => {
                            setEditingAturan(a);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="user-action-btn user-btn-delete"
                          onClick={() => handleDelete(a.id!)}
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <RuleForm
              initialData={editingAturan}
              onSave={handleSave}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* STYLE */}
      <style jsx>{`
        .user-page {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-header h3 {
          color: #ffffff;
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .user-button-add {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #4f46e5, #6366f1);
          color: white;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }

        .user-button-add:hover {
          background: linear-gradient(90deg, #6366f1, #818cf8);
          transform: translateY(-1px);
        }

        .user-table-container {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          color: #d1d5db;
        }

        .user-table thead {
          background: #1f2937;
          color: #9ca3af;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .user-table th,
        .user-table td {
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .user-table tbody tr {
          border-bottom: 1px solid #1f2937;
          transition: background 0.2s ease;
        }

        .user-table tbody tr:hover {
          background: rgba(55, 65, 81, 0.4);
        }

        .user-table td:last-child {
          text-align: right;
        }

        .user-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .user-action-btn:hover {
          transform: scale(1.1);
        }

        .user-btn-edit {
          color: #818cf8;
        }

        .user-btn-edit:hover {
          color: #a5b4fc;
        }

        .user-btn-delete {
          color: #f87171;
        }

        .user-btn-delete:hover {
          color: #fca5a5;
        }

        .user-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
          padding: 1rem;
        }

        .user-modal {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 1rem;
          padding: 2rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 0 30px rgba(17, 24, 39, 0.7);
          animation: fadeInScale 0.25s ease;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
