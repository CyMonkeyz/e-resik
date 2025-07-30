import { Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import "./output.css";

export default function Root() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}
