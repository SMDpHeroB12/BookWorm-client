"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (user.role === "admin") router.replace("/admin/dashboard");
      else router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (user) return null;

  return children;
}
