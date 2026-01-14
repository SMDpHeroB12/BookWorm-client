"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import Swal from "sweetalert2";

export default function RegisterClient() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ show/hide
  const [loading, setLoading] = useState(false);

  // ✅ Password rules
  const passwordChecks = useMemo(() => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const minLen = password.length >= 6;

    const score = [minLen, hasUpper, hasLower, hasNumber].filter(
      Boolean
    ).length;

    let label = "Weak";
    if (score === 4) label = "Strong";
    else if (score >= 3) label = "Medium";

    // progress percent
    const percent = (score / 4) * 100;

    return { hasUpper, hasLower, hasNumber, minLen, score, label, percent };
  }, [password]);

  const passwordIsValid =
    passwordChecks.minLen &&
    passwordChecks.hasUpper &&
    passwordChecks.hasLower &&
    passwordChecks.hasNumber;

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary env missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Name, email, and password are required");
    }

    // ✅ Strict password validation
    if (!passwordIsValid) {
      return toast.error(
        "Password must be at least 6 characters and include 1 capital, 1 small, and 1 number"
      );
    }

    if (!photoFile) {
      return toast.error("Please upload a profile photo");
    }

    setLoading(true);

    try {
      // 1) Upload photo
      const photoUrl = await uploadToCloudinary(photoFile);

      // 2) Register API
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, photo: photoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) toast.error("Email already exists");
        else toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ SweetAlert2 on success (Requirement)
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created. Now login to continue.",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#b45309", // amber-700
        background: "#fffbeb", // amber-50
      });

      router.replace("/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Meter color without changing overall UI layout
  const meterColor =
    passwordChecks.label === "Strong"
      ? "bg-emerald-600"
      : passwordChecks.label === "Medium"
      ? "bg-amber-600"
      : "bg-rose-600";

  return (
    <PublicOnlyRoute>
      <div className="min-h-[70vh] grid place-items-center">
        <div className="w-full max-w-md">
          <Card className="p-5 sm:p-6">
            <div className="space-y-2">
              <p className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                Join BookWorm
              </p>
              <h1 className="text-2xl font-bold tracking-tight">Register</h1>
              <p className="text-sm text-gray-600">
                Create your account to start tracking books.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  {/* ✅ Always-visible Show/Hide */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-xs font-medium text-amber-800 hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* ✅ Weak Password Meter (below password box) */}
                <div className="space-y-2 pt-1">
                  <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden border border-amber-200">
                    <div
                      className={`h-full ${meterColor}`}
                      style={{ width: `${passwordChecks.percent}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-600">
                    Strength:{" "}
                    <span className="font-semibold">
                      {passwordChecks.label}
                    </span>
                  </div>

                  {/* ✅ Rule hints (no heavy UI change, small helper text) */}
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li
                      className={
                        passwordChecks.minLen ? "text-emerald-700" : ""
                      }
                    >
                      • Minimum 6 characters
                    </li>
                    <li
                      className={
                        passwordChecks.hasUpper ? "text-emerald-700" : ""
                      }
                    >
                      • At least 1 Capital letter (A-Z)
                    </li>
                    <li
                      className={
                        passwordChecks.hasLower ? "text-emerald-700" : ""
                      }
                    >
                      • At least 1 Small letter (a-z)
                    </li>
                    <li
                      className={
                        passwordChecks.hasNumber ? "text-emerald-700" : ""
                      }
                    >
                      • At least 1 Number (0-9)
                    </li>
                  </ul>
                </div>
              </div>

              <Button disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link className="text-amber-800 hover:underline" href="/login">
                Login
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
