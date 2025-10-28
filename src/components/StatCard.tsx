export default function StatCard({
  title,
  value,
  className,
}: {
  title: string;
  value: string | number;
  className?: string; // tambahkan ini
}) {
  return (
    <div
      className={`bg-[#0f1117] border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-purple-500/10 transition-all ${className}`}
    >
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  );
}
