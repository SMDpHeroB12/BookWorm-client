"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    router.push("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const userLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/browse", label: "Browse Books" },
    { href: "/my-library", label: "My Library" },
    { href: "/tutorials", label: "Tutorials" },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/books", label: "Books" },
    { href: "/admin/genres", label: "Genres" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/tutorials", label: "Tutorials" },
    { href: "/admin/users", label: "Users" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <header className="border-b border-amber-200/60 bg-amber-50/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href={
            user
              ? user.role === "admin"
                ? "/admin/dashboard"
                : "/dashboard"
              : "/"
          }
          className="font-semibold tracking-tight"
          onClick={() => {
            setProfileOpen(false);
            closeMobile();
          }}
        >
          <span className="text-amber-700">Book</span>
          <span className="text-gray-900">Worm</span>
        </Link>

        {/* Center: Desktop Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-amber-800">
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right: Auth area */}
        <div className="flex items-center gap-2">
          {/* If not logged in */}
          {!user && (
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/login" className="hover:text-amber-800">
                Login
              </Link>
              <Link href="/register" className="hover:text-amber-800">
                Register
              </Link>
            </nav>
          )}

          {/* Mobile Hamburger (only when logged in) */}
          {user && (
            <button
              onClick={() => {
                setMobileOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white/80 px-3 py-2"
              aria-label="Toggle menu"
            >
              {/* simple icon */}
              <span className="text-lg leading-none">☰</span>
            </button>
          )}

          {/* Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setMobileOpen(false);
                }}
                className="w-10 h-10 rounded-full border border-amber-200 overflow-hidden bg-white flex items-center justify-center text-sm font-semibold"
                title="Profile"
                aria-label="Profile menu"
              >
                {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-amber-200 bg-white shadow-md p-2 text-sm z-50">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-lg hover:bg-amber-50"
                    onClick={() => setProfileOpen(false)}
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
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {user && mobileOpen && (
        <div className="md:hidden border-t border-amber-200/60 bg-white/80">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col gap-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-2 hover:bg-amber-50"
                onClick={closeMobile}
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/profile"
              className="rounded-xl px-3 py-2 hover:bg-amber-50"
              onClick={closeMobile}
            >
              My Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-left rounded-xl px-3 py-2 hover:bg-amber-50"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
