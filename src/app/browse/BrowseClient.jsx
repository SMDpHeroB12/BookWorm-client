"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BrowseClient() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);

  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []));

    fetch(`${API_BASE_URL}/api/genres`)
      .then((res) => res.json())
      .then((data) => setGenres(Array.isArray(data) ? data : []));
  }, []);

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return books.filter((b) => {
      const matchesQuery =
        !q ||
        (b.title || "").toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q);

      const matchesGenre = !selectedGenre || b.genre === selectedGenre;

      return matchesQuery && matchesGenre;
    });
  }, [books, query, selectedGenre]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [query, selectedGenre]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Browse Books
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Search by title/author, filter by genre, and pick your next read.
          </p>
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by title or author..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <select
              className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g._id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{filtered.length}</span>{" "}
            books
          </div>
        </Card>

        {/* List */}
        {paginated.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600">No books match your search.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((b) => (
              <Link key={b._id} href={`/books/${b._id}`}>
                <Card className="p-3 hover:-translate-y-px transition">
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
                      {b.author}
                    </p>
                    <p className="text-xs text-amber-800">{b.genre}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-xl border border-amber-200 px-3 py-2 text-sm disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            className="rounded-xl border border-amber-200 px-3 py-2 text-sm disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
