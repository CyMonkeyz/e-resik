import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UserState {
  poin: number;
  notifikasi: string[];
  progress: number; // misal untuk progress chart
}

const defaultValue: UserState = {
  poin: 120,
  notifikasi: ["Selamat datang di e-Resik!"],
  progress: 80,
};

const UserContext = createContext<{
  user: UserState;
  addPoin: (jumlah: number) => void;
  addNotifikasi: (pesan: string) => void;
  addProgress: (jumlah: number) => void;
}>({
  user: defaultValue,
  addPoin: () => {},
  addNotifikasi: () => {},
  addProgress: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultValue);

  const addPoin = (jumlah: number) => setUser(u => ({ ...u, poin: u.poin + jumlah }));
  const addNotifikasi = (pesan: string) => setUser(u => ({ ...u, notifikasi: [pesan, ...u.notifikasi] }));
  const addProgress = (jumlah: number) =>
    setUser(u => ({ ...u, progress: Math.min(u.progress + jumlah, 100) }));

  return (
    <UserContext.Provider value={{ user, addPoin, addNotifikasi, addProgress }}>
      {children}
    </UserContext.Provider>
  );
}
