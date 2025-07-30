import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Selamat Datang di e-Resik!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Pilih menu di atas untuk mulai menggunakan aplikasi.
      </p>
      <div className="flex gap-4">
        <Link to="/masyarakat/dashboard" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Dashboard Masyarakat
        </Link>
        <Link to="/pengelola/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Dashboard Pengelola
        </Link>
      </div>
    </div>
  );
}
