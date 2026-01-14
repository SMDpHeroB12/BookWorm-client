"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardClient() {
  const [books, setBooks] = useState([]);
  const [libraryItems, setLibraryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [booksRes, libraryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/books`),
        fetch(`${API_BASE_URL}/api/library/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const booksData = await booksRes.json();
      const libraryData = await libraryRes.json();

      setBooks(Array.isArray(booksData) ? booksData : []);
      setLibraryItems(Array.isArray(libraryData) ? libraryData : []);
    } catch {
      setBooks([]);
      setLibraryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAll();
  }, [token]);

  // Stats
  const stats = useMemo(() => {
    const want = libraryItems.filter((i) => i.shelf === "want").length;
    const current = libraryItems.filter((i) => i.shelf === "current").length;
    const read = libraryItems.filter((i) => i.shelf === "read").length;
    return { want, current, read };
  }, [libraryItems]);

  // Exclude books already in user's library
  const libraryBookIds = useMemo(() => {
    return new Set(libraryItems.map((i) => String(i.bookId?._id || i.bookId)));
  }, [libraryItems]);

  // Simple “personalized” recommendations:
  // show newest books not already in library
  const recommended = useMemo(() => {
    const notInLibrary = books.filter(
      (b) => !libraryBookIds.has(String(b._id))
    );
    return notInLibrary.slice(0, 6);
  }, [books, libraryBookIds]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your reading overview and cozy recommendations.
          </p>
        </div>

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
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold mt-1">{stats.read}</p>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/browse">
            <Card className="p-4 hover:-translate-y-[1px] transition">
              <p className="font-semibold">Browse books</p>
              <p className="text-sm text-gray-600 mt-1">
                Find a new book and add it to your shelf.
              </p>
            </Card>
          </Link>

          <Link href="/my-library">
            <Card className="p-4 hover:-translate-y-[1px] transition">
              <p className="font-semibold">Go to My Library</p>
              <p className="text-sm text-gray-600 mt-1">
                Update shelf and progress.
              </p>
            </Card>
          </Link>
        </div>

        {/* Recommendations */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">
            Recommended for you
          </h2>
          <Link
            href="/browse"
            className="text-sm text-amber-800 hover:underline"
          >
            Browse all →
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : recommended.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600">
              You already added many books! Explore{" "}
              <Link href="/browse" className="text-amber-800 underline">
                Browse
              </Link>{" "}
              to find more.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((b) => (
              <Link key={b._id} href={`/books/${b._id}`}>
                <Card className="p-3 hover:-translate-y-[1px] transition">
                  <Image
                    src={b.coverImage}
                    alt={b.title}
                    width={300}
                    height={450}
                    className="w-full h-112.5 object-contain rounded-md"
                  />
                  <div className="mt-3 space-y-1">
                    <p className="font-semibold line-clamp-1">{b.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {b.author} • {b.genre}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
