// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { UserProvider } from "./context/UserContext";
import { AppProvider } from "./context/AppContext";
import "./app.css";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <UserProvider>
          <AppProvider>
            <Outlet />
          </AppProvider>
        </UserProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}