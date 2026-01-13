"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/my-library");
    }
  }, [user, loading]);

  return null;
}
