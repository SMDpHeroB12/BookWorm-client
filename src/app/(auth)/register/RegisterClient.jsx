"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
// import { useAuth } from "@/context/AuthContext";

export default function RegisterClient() {
  const router = useRouter();
  // const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
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

      toast.success("Registration successful ✅");

      router.replace("/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
