import Navbar from "../../components/Navbar";
import React, { useState } from "react";
import { useUser } from "../../context/UserContext";

export default function JadwalSetor() {
  const [form, setForm] = useState({ jenis: "", berat: "", tanggal: "" });
  const [submitted, setSubmitted] = useState(false);

  const { addPoin, addNotifikasi, addProgress } = useUser();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulasikan update: setiap setor tambah 10 poin dan 5% progress
    addPoin(10);
    addProgress(5);
    addNotifikasi(
      `Setoran ${form.jenis} (${form.berat}kg) pada ${form.tanggal} berhasil!`
    );
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Jadwal Setor</h1>
        <form
          className="bg-white p-4 rounded shadow flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Jenis Sampah"
            className="border p-2 rounded"
            value={form.jenis}
            onChange={e => setForm(f => ({ ...f, jenis: e.target.value }))}
            required
          />
          <input
            type="number"
            placeholder="Berat (kg)"
            className="border p-2 rounded"
            value={form.berat}
            onChange={e => setForm(f => ({ ...f, berat: e.target.value }))}
            required
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={form.tanggal}
            onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Setor
          </button>
        </form>
        {submitted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            Setoran berhasil diajukan!
          </div>
        )}
      </main>
    </>
  );
}
