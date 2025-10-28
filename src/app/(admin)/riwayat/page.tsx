"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import "../../../styles/riwayat.css";

type DiagnosisHistory = {
  id: string;
  accuracy: number;
  diagnosisName: string;
  finalDiagnosisId: string;
  isSuccess: boolean;
  kategori: string;
  matchedDiagnosisIds: string[];
  perawatan: string[];
  timestamp: string;
  userId: string;
};

export default function RiwayatDiagnosisPage() {
  const [data, setData] = useState<DiagnosisHistory[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({}); // userId → userName
  const [loading, setLoading] = useState(true);

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Ambil riwayat diagnosis
        const q = query(
          collection(db, "diagnose_history"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const records: DiagnosisHistory[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DiagnosisHistory, "id">),
        }));
        setData(records);

        // Ambil nama user
        const userIds = Array.from(new Set(records.map((r) => r.userId))); // unique userIds
        const userData: Record<string, string> = {};

        await Promise.all(
          userIds.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              userData[uid] = userDoc.data().name || "Unknown";
            } else {
              userData[uid] = "Unknown";
            }
          })
        );

        setUserMap(userData);
      } catch (err) {
        console.error("Gagal mengambil riwayat diagnosis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="riwayat-loading">
        <Loader2 className="animate-spin" />
        Memuat data riwayat diagnosis...
      </div>
    );

  return (
    <div className="riwayat-page">
      <div className="riwayat-header">
        <h3>Riwayat Diagnosis</h3>
      </div>

      {data.length === 0 ? (
        <p className="riwayat-empty">Belum ada data riwayat diagnosis.</p>
      ) : (
        <div className="riwayat-table-container">
          <table className="riwayat-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Diagnosis</th>
                <th>Kategori</th>
                <th>Accuracy (%)</th>
                <th>Perawatan</th>
                <th>Matched ID</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.timestamp).toLocaleString("id-ID")}</td>
                  <td>{item.diagnosisName}</td>
                  <td>{item.kategori}</td>
                  <td>{item.accuracy}</td>
                  <td>
                    <ul>
                      {item.perawatan.map((p, i) => (
                        <li key={i}>{capitalizeFirstLetter(p)}</li>
                      ))}
                    </ul>
                  </td>

                  <td>{item.matchedDiagnosisIds.join(", ")}</td>
                  <td>{userMap[item.userId] || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
