"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardClient() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const recommended = useMemo(() => books.slice(0, 6), [books]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your reading overview and recommendations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Want to Read</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Currently Reading</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </Card>
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
              No books found. Ask admin to add books.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((b) => (
              <Link key={b._id} href={`/books/${b._id}`}>
                <Card className="p-3 hover:-translate-y-px transition">
                  <Image
                    src={b.coverImage}
                    alt={b.title}
                    width={300}
                    height={450}
                    className="w-full h-112.5 object-contain rounded-md"
                  />
                  <div className="mt-3">
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
