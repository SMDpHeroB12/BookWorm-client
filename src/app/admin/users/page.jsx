"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { confirmAction } from "@/lib/confirm";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, nextRole, currentRole) => {
    if (nextRole === currentRole) return;

    const ok = await confirmAction({
      title: "Change user role?",
      text: `Set role to "${nextRole}"?`,
      confirmText: "Yes, change",
      icon: "question",
    });

    if (!ok) return;

    try {
      setWorkingId(userId);
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: nextRole }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success("Role updated ✅");
      fetchUsers();
    } catch (e) {
      toast.error(e.message || "Failed");
      fetchUsers();
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Users
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View users and change roles (admin only).
          </p>
        </div>

        <Card className="p-4 sm:p-6">
          {loading ? (
            <LoadingSpinner label="Loading users..." />
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-600">No users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="rounded-md border border-amber-200/70 bg-white/80 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">
                        {u.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600 break-words">
                        {u.email}
                      </p>
                      <p className="text-xs text-gray-600">
                        Current role:{" "}
                        <span className="font-semibold text-gray-900">
                          {u.role}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        className="rounded border border-amber-200 bg-white/90 px-3 py-2 text-sm"
                        value={u.role}
                        disabled={workingId === u._id}
                        onChange={(e) =>
                          updateRole(u._id, e.target.value, u.role)
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>

                      {workingId === u._id && (
                        <LoadingSpinner label="Saving..." />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
