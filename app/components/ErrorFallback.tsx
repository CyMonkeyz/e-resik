// app/components/ErrorFallback.tsx
export function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800 font-bold">Something went wrong:</h2>
      <pre className="text-red-600 text-sm">{error.message}</pre>
    </div>
  );
}
