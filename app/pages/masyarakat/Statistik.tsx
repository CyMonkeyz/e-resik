import Navbar from "../../components/Navbar";
import StatistikChart from "../../components/StatistikChart";

export default function Statistik() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Statistik Setoran</h1>
        <StatistikChart />
      </main>
    </>
  );
}
