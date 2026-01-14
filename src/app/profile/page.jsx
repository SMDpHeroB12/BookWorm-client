"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/api/library/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, [token]);

  const stats = useMemo(() => {
    const want = items.filter((i) => i.shelf === "want").length;
    const current = items.filter((i) => i.shelf === "current").length;
    const read = items.filter((i) => i.shelf === "read").length;
    return { want, current, read };
  }, [items]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Your account info and reading overview.
          </p>
        </div>

        {/* Profile Info */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full border border-amber-200 overflow-hidden bg-amber-50 flex items-center justify-center font-bold text-amber-800">
              {user?.photo ? (
                <Image
                  src={user.photo}
                  alt={user.name || "Profile"}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.slice(0, 1)?.toUpperCase() || "U"
              )}
            </div>

            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="text-sm text-gray-600">{user?.email}</p>

              <p className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800 mt-2">
                Role: {user?.role}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Want to Read</p>
            <p className="text-2xl font-bold mt-1">{stats.want}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-600">Currently Reading</p>
            <p className="text-2xl font-bold mt-1">{stats.current}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-600">Read</p>
            <p className="text-2xl font-bold mt-1">{stats.read}</p>
          </Card>
        </div>

        {/* Small note */}
        <Card className="p-4 sm:p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Tip: You can manage shelves and progress from{" "}
            <span className="font-semibold text-gray-900">My Library</span>.
          </p>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
