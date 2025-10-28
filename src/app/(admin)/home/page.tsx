"use client";
import "../../../styles/home.css";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type DiagnoseHistoryType = {
  id: string;
  userId: string;
  diagnosisName: string;
  isSuccess: boolean;
  perawatan: string[];
  selectedIds: string[];
  timestamp: string;
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-800/90 border border-gray-700 rounded shadow-lg text-sm text-white">
        <p className="font-semibold text-violet-400">{label}</p>
        <p>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [diagnoseHistory, setDiagnoseHistory] = useState<DiagnoseHistoryType[]>(
    []
  );
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [userCount, setUserCount] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [surveyCount, setSurveyCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ===== Get diagnose history =====
        const historySnap = await getDocs(collection(db, "diagnose_history"));
        const historyData: DiagnoseHistoryType[] = historySnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<DiagnoseHistoryType, "id">),
          })
        );
        setDiagnoseHistory(historyData);

        // ===== Get users =====
        const usersSnap = await getDocs(collection(db, "users"));
        setUserCount(usersSnap.size);

        // ===== Get surveys =====
        const surveysSnap = await getDocs(collection(db, "app_surveys"));
        setSurveyCount(surveysSnap.size);

        // ===== Prepare chart data =====
        const chartMap: Record<string, number> = {};
        historyData.forEach((item) => {
          const date = new Date(item.timestamp).toLocaleDateString("id-ID", {
            month: "numeric",
            day: "numeric",
          });
          chartMap[date] = (chartMap[date] || 0) + 1;
        });

        const chartArray = Object.entries(chartMap)
          .map(([date, count]) => ({ date, count }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setChartData(chartArray);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // ===== Stats Section =====
  const stats = useMemo(
    () => [
      { title: "TOTAL DIAGNOSIS", value: diagnoseHistory.length, icon: "🩺" },
      { title: "TOTAL USERS", value: userCount, icon: "👥" },
      { title: "TOTAL SURVEY", value: surveyCount, icon: "📝" }, // ganti dari TOTAL PENYAKIT
    ],
    [diagnoseHistory.length, userCount, surveyCount]
  );

  const recentActivities = useMemo(() => {
    return diagnoseHistory
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 5);
  }, [diagnoseHistory]);

  return (
    <div className="admin-page">
      <header className="page-header">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">
            Ringkasan statistik, aktivitas terbaru, dan grafik harian
          </p>
        </div>
      </header>

      {/* ===== Stats Section ===== */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.title} className="stat-card">
            <div className="flex items-start justify-between">
              <p className="stat-title">{s.title}</p>
              <span className="stat-icon">{s.icon}</span>
            </div>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ===== Main Content ===== */}
      <div className="dashboard-content">
        {/* Chart */}
        <div className="chart-card">
          <h3 className="dashboard-card-title">Aktivitas Harian (Diagnosis)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <XAxis
                  dataKey="date"
                  stroke="#a1a1aa"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#a1a1aa"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Jumlah Diagnosis"
                  radius={[10, 10, 0, 0]}
                  barSize={36}
                  animationDuration={700}
                  onMouseEnter={(_, index) => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        hoveredBar === index ? "#c4b5fd" : "url(#barGradient)"
                      }
                    />
                  ))}
                </Bar>

                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="activity-card">
          <h3 className="dashboard-card-title">Aktivitas Terbaru</h3>
          <ul className="activity-list">
            {recentActivities.map((a) => (
              <li key={a.id} className="activity-item">
                <div>
                  <p className="activity-name">{a.diagnosisName}</p>
                  <p className="activity-date">
                    {new Date(a.timestamp).toLocaleString("id-ID")}
                  </p>
                </div>
                <span
                  className={`status-badge ${
                    a.isSuccess ? "success" : "failed"
                  }`}
                >
                  {a.isSuccess ? "Sukses" : "Gagal"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
