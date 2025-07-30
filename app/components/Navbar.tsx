import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-green-600 text-white shadow">
      <div className="font-bold text-xl tracking-tight">e-Resik</div>
      <div className="flex gap-4">
        <Link
          to="/masyarakat/dashboard"
          className={`px-4 py-2 rounded hover:bg-green-700 transition font-medium ${location.pathname.startsWith("/masyarakat") ? "bg-green-700" : ""}`}
        >
          Masyarakat
        </Link>
        <Link
          to="/pengelola/dashboard"
          className={`px-4 py-2 rounded hover:bg-green-700 transition font-medium ${location.pathname.startsWith("/pengelola") ? "bg-green-700" : ""}`}
        >
          Pengelola
        </Link>
      </div>
    </nav>
  );
}