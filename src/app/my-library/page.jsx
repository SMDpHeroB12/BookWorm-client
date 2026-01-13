import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyLibrary() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">My Library </h1>
      </div>
    </ProtectedRoute>
  );
}
