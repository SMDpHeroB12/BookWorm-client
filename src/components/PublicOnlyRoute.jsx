"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner label="Loading..." />
      </div>
    );
  if (user) return null;

  return children;
}
