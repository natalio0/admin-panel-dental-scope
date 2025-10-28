"use client";

export default function TableExample({ data }: { data: any[] }) {
  if (!data?.length) return <div className="card p-4">Tidak ada data</div>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto card rounded-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="table-head">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left">
                {h.toUpperCase()}
              </th>
            ))}
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id} className="table-row hover:bg-white/2">
              {headers.map((h) => (
                <td key={h} className="px-4 py-3">
                  {row[h]}
                </td>
              ))}
              <td className="px-4 py-3 flex gap-3">
                <button className="text-[var(--accent)]">Edit</button>
                <button className="text-red-400">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
