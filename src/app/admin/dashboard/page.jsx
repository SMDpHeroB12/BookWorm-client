import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = { title: "BookWorm | Admin Dashboard" };

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}
