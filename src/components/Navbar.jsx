"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-amber-200/60 bg-amber-50/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold tracking-tight">
          <span className="text-amber-700">Book</span>
          <span className="text-gray-900">Worm</span>
        </Link>

        {/* Links */}
        {user && user.role === "user" && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-amber-800">
              Dashboard
            </Link>
            <Link href="/browse" className="hover:text-amber-800">
              Browse Books
            </Link>
            <Link href="/my-library" className="hover:text-amber-800">
              My Library
            </Link>
            <Link href="/tutorials" className="hover:text-amber-800">
              Tutorials
            </Link>
          </nav>
        )}

        {user && user.role === "admin" && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/admin/dashboard" className="hover:text-amber-800">
              Dashboard
            </Link>
            <Link href="/admin/books" className="hover:text-amber-800">
              Books
            </Link>
            <Link href="/admin/genres" className="hover:text-amber-800">
              Genres
            </Link>
            <Link href="/admin/reviews" className="hover:text-amber-800">
              Reviews
            </Link>
            <Link href="/admin/tutorials" className="hover:text-amber-800">
              Tutorials
            </Link>
            <Link href="/admin/users" className="hover:text-amber-800">
              Users
            </Link>
          </nav>
        )}

        {/* Profile */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full border border-amber-200 overflow-hidden bg-white flex items-center justify-center text-sm font-semibold"
              title="Profile"
            >
              {/* If no image: show first letter */}
              {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-md p-2 text-sm">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-amber-50"
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="hover:text-amber-800">
              Login
            </Link>
            <Link href="/register" className="hover:text-amber-800">
              Register
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
