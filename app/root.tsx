// app/root.tsx - Fixed version
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { UserProvider } from "./context/UserContext";
import "./app.css";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <UserProvider>
          <Outlet />
        </UserProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Also add error boundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-4">There was an error loading the application.</p>
        <details className="text-sm text-gray-500">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
        </details>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}