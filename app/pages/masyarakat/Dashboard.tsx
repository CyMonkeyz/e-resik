import Navbar from "../../components/Navbar";
import CardStat from "../../components/CardStat";
import ProgressChart from "../../components/ProgressChart";
import { useUser } from "../../context/UserContext";

export default function DashboardMasyarakat() {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Dashboard Masyarakat</h1>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <CardStat label="Poin" value={user.poin} />
          <CardStat label="Progress" value={`${user.progress}%`} />
          <CardStat label="Notifikasi" value={user.notifikasi[0] ?? "Tidak ada notif baru"} color="text-gray-700" />
        </section>
        <ProgressChart progress={user.progress} />
      </main>
    </>
  );
}
