import { Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import "./app.css";

export default function Root() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}
