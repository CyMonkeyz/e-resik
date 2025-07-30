interface LeaderboardItem {
  nama: string;
  poin: number;
}

const leaderboardDummy: LeaderboardItem[] = [
  { nama: "Budi", poin: 150 },
  { nama: "Tika", poin: 140 },
  { nama: "Dian", poin: 125 },
];

export default function Leaderboard() {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="font-bold mb-2 text-green-700">Leaderboard Mingguan</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-2 py-1">Peringkat</th>
            <th className="text-left px-2 py-1">Nama</th>
            <th className="text-left px-2 py-1">Poin</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardDummy.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-2 py-1 font-bold">{idx + 1}</td>
              <td className="px-2 py-1">{item.nama}</td>
              <td className="px-2 py-1">{item.poin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
