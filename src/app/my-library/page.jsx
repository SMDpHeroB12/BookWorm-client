"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TABS = [
  { key: "want", label: "Want to Read" },
  { key: "current", label: "Currently Reading" },
  { key: "read", label: "Read" },
];

export default function MyLibraryPage() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("want");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchLibrary = async () => {
    const res = await fetch(`${API_BASE_URL}/api/library/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const filtered = useMemo(
    () => items.filter((i) => i.shelf === tab),
    [items, tab]
  );

  const updateItem = async (bookId, patch) => {
    const res = await fetch(`${API_BASE_URL}/api/library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId, ...patch }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Update failed");
    fetchLibrary();
  };

  const removeItem = async (bookId) => {
    if (!confirm("Remove from your library?")) return;

    const res = await fetch(`${API_BASE_URL}/api/library/${bookId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Remove failed");
    fetchLibrary();
  };

  return (
    <ProtectedRoute>
      <div className="space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Library
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Organize your books into shelves and track your progress.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "rounded-xl px-4 py-2 text-sm border transition " +
                (tab === t.key
                  ? "bg-amber-700 text-white border-amber-700"
                  : "bg-white/80 border-amber-200 hover:bg-amber-50")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600">
              No books in this shelf yet. Go to{" "}
              <Link className="text-amber-800 underline" href="/browse">
                Browse
              </Link>{" "}
              and add some.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((i) => {
              const b = i.bookId;
              return (
                <Card key={i._id} className="p-3 space-y-3">
                  <Link href={`/books/${b._id}`}>
                    <Image
                      src={b.coverImage}
                      alt={b.title}
                      width={300}
                      height={450}
                      className="w-full h-auto rounded-xl"
                    />
                  </Link>

                  <div className="space-y-1">
                    <p className="font-semibold line-clamp-1">{b.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {b.author} • {b.genre}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{i.progress}%</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={i.progress}
                      onChange={(e) =>
                        updateItem(b._id, { progress: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Shelf actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="border rounded-xl px-3 py-1 text-sm"
                      onClick={() => updateItem(b._id, { shelf: "want" })}
                    >
                      Want
                    </button>
                    <button
                      className="border rounded-xl px-3 py-1 text-sm"
                      onClick={() => updateItem(b._id, { shelf: "current" })}
                    >
                      Current
                    </button>
                    <button
                      className="border rounded-xl px-3 py-1 text-sm"
                      onClick={() =>
                        updateItem(b._id, { shelf: "read", progress: 100 })
                      }
                    >
                      Read
                    </button>

                    <button
                      className="border rounded-xl px-3 py-1 text-sm"
                      onClick={() => removeItem(b._id)}
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
