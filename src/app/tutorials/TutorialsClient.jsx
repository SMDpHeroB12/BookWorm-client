"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

function getYouTubeId(url = "") {
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id || "";
    }

    // youtube.com/watch?v=<id>
    if (u.searchParams.get("v")) return u.searchParams.get("v");

    // youtube.com/embed/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex !== -1 && parts[embedIndex + 1])
      return parts[embedIndex + 1];

    return "";
  } catch {
    return "";
  }
}

export default function TutorialsClient() {
  const [tutorials, setTutorials] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);

        // ✅ If your API is protected, keep token header.
        // If it's public, it still works.
        const res = await fetch(`${API_BASE_URL}/api/tutorials`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed to fetch tutorials");
        const data = await res.json();

        // Expecting: [{ _id, title, description, videoUrl }]
        setTutorials(Array.isArray(data) ? data : []);
      } catch {
        // Fallback demo list (so page never breaks)
        setTutorials([
          {
            _id: "demo-1",
            title: "How to build a reading habit",
            description:
              "A short guide to start reading daily with small goals.",
            videoUrl: "https://www.youtube.com/watch?v=4A1w0C6YxqQ",
          },
          {
            _id: "demo-2",
            title: "How to choose your next book",
            description: "Pick books by mood, genre, and reading time.",
            videoUrl: "https://www.youtube.com/watch?v=Gv6V3Ww4w4I",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tutorials;

    return tutorials.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [tutorials, query]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Tutorials
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Watch curated videos to improve your reading habits and book
            choices.
          </p>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search tutorials..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              Showing{" "}
              <span className="font-semibold mx-1">{filtered.length}</span>{" "}
              tutorial{filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </Card>

        {/* List */}
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600">No tutorials found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((t) => {
              const id = getYouTubeId(t.videoUrl || t.youtubeUrl || "");
              const embedUrl = id ? `https://www.youtube.com/embed/${id}` : "";

              return (
                <Card key={t._id} className="p-4 sm:p-5">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                        Tutorial
                      </p>
                      <h2 className="text-lg sm:text-xl font-semibold">
                        {t.title}
                      </h2>
                      {t.description ? (
                        <p className="text-sm text-gray-600">{t.description}</p>
                      ) : null}
                    </div>

                    {/* Responsive embed */}
                    {embedUrl ? (
                      <div className="relative w-full overflow-hidden rounded-2xl border border-amber-200/70 bg-white">
                        <div className="pt-[56.25%]" />
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={embedUrl}
                          title={t.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-amber-200/70 bg-white/80 p-4">
                        <p className="text-sm text-gray-600 wrap-break-words">
                          Invalid YouTube URL:{" "}
                          {t.videoUrl || t.youtubeUrl || ""}
                        </p>
                      </div>
                    )}
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
