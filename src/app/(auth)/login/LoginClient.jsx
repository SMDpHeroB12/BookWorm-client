"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";

export default function LoginClient() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async (e, em = email, pw = password) => {
    if (e) e.preventDefault();
    setLoading(true);

    const ok = await login(em, pw); // ensure login returns boolean
    setLoading(false);

    if (ok) {
      toast.success("Login successful ✅");
      router.replace("/"); // root redirect will send to dashboard/admin
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <PublicOnlyRoute>
      <div className="min-h-[70vh] grid place-items-center">
        <div className="w-full max-w-md">
          <Card className="p-5 sm:p-6">
            <div className="space-y-2">
              <p className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                Welcome back
              </p>
              <h1 className="text-2xl font-bold tracking-tight">Login</h1>
              <p className="text-sm text-gray-600">
                Sign in to continue reading.
              </p>
            </div>

            <form onSubmit={doLogin} className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>
            {/* Demo buttons */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  doLogin(null, "mdshishir@gmail.com", "sisir123MD")
                }
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
              >
                Demo Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  doLogin(null, "md.bellal010@gmail.com", "bellal010MD")
                }
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
              >
                Demo User
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              New here?{" "}
              <Link className="text-amber-800 hover:underline" href="/register">
                Create an account
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
