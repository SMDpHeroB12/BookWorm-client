"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data);
      } catch (e) {
        toast.error(e.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <ProtectedRoute adminOnly>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        {loading ? (
          <Card className="p-6">
            <LoadingSpinner label="Loading admin stats..." />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold mt-1">
                {stats?.totalBooks ?? 0}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold mt-1">
                {stats?.totalUsers ?? 0}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold mt-1">
                {stats?.pendingReviews ?? 0}
              </p>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
