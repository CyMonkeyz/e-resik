import Navbar from "../../components/Navbar";
import Badge from "../../components/Badge";
import Leaderboard from "../../components/Leaderboard";

export default function Gamifikasi() {
  // Dummy data badge
  const badges = [
    { label: "Pemilah Sampah Pemula", achieved: true },
    { label: "Pahlawan Daur Ulang", achieved: false },
    { label: "Setoran Rutin", achieved: true },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Gamifikasi & Badge</h1>
        <div className="mb-4">
          {badges.map((badge, idx) => (
            <Badge key={idx} label={badge.label} achieved={badge.achieved} />
          ))}
        </div>
        <Leaderboard /> 
      </main>
    </>
  );
}
