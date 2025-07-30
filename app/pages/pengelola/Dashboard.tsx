import Navbar from "../../components/Navbar";
import CardStat from "../../components/CardStat";
import KPIChart from "../../components/KPIChart";

export default function DashboardPengelola() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Dashboard Pengelola</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <CardStat label="Setoran Hari Ini" value={9} color="text-blue-700" />
          <CardStat label="Warga Aktif" value={35} color="text-blue-700" />
          <CardStat label="Total Sampah (kg)" value={285} color="text-blue-700" />
        </section>
        <section className="mt-8">
          <KPIChart />
        </section>
      </main>
    </>
  );
}
