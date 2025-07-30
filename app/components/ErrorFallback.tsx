import React from "react";

interface ErrorFallbackProps {
  error: Error;
}

export default function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-16">
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
  );
}
