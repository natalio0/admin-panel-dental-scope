"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import "../../../styles/riwayat.css";

type Survey = {
  id: string;
  rating: string;
  saran: string;
  timestamp: string; // timestamp di Firestore disimpan sebagai string ISO
  userId: string;
  userName?: string;
};

export default function SurveyPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const q = query(
          collection(db, "app_surveys"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);

        const data: Survey[] = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const surveyData = docSnap.data() as Survey;

            // Ambil nama user dari collection users
            let userName = "Anonim";
            if (surveyData.userId) {
              const userRef = doc(db, "users", surveyData.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                userName = (userSnap.data() as any).name || "Anonim";
              }
            }

            return {
              ...surveyData,
              id: docSnap.id,
              userName,
            };
          })
        );

        setSurveys(data);
      } catch (error) {
        console.error("Gagal mengambil data survey:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "—" : date.toLocaleString();
  };

  return (
    <div className="riwayat-page">
      <div className="riwayat-header">
        <h3>Daftar Survey</h3>
      </div>

      {loading ? (
        <div className="riwayat-loading">
          <span>Memuat data...</span>
        </div>
      ) : surveys.length === 0 ? (
        <div className="riwayat-empty">Belum ada survey yang dikirim.</div>
      ) : (
        <div className="riwayat-table-container">
          <table className="riwayat-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Saran</th>
                <th>Timestamp</th>
                <th>Nama User</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id}>
                  <td>{survey.rating}</td>
                  <td>{survey.saran}</td>
                  <td>{formatDate(survey.timestamp)}</td>
                  <td>{survey.userName || "Anonim"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
