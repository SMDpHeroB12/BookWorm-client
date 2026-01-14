"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirectClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) router.replace("/login");
    else if (user.role === "admin") router.replace("/admin/dashboard");
    else router.replace("/dashboard");
  }, [user, loading, router]);

  return null;
}
