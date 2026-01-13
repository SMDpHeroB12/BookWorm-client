"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    fetchUsers();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>

        {users.length === 0 ? (
          <p className="text-sm text-gray-600">No users found.</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u._id}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="border p-2"
                    defaultValue={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>

                  <span className="text-sm text-gray-600">
                    current: {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
