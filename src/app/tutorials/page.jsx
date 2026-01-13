"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    const embedIndex = parts.indexOf("embed");
    if (embedIndex !== -1 && parts[embedIndex + 1])
      return parts[embedIndex + 1];
    return null;
  } catch {
    return null;
  }
}

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tutorials`)
      .then((res) => res.json())
      .then((data) => setTutorials(Array.isArray(data) ? data : []));
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tutorials</h1>

        {tutorials.length === 0 ? (
          <p className="text-sm text-gray-600">No tutorials available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutorials.map((t) => {
              const id = getYouTubeId(t.youtubeUrl);
              return (
                <div key={t._id} className="border rounded p-3 space-y-2">
                  <p className="font-semibold">{t.title}</p>

                  {id ? (
                    <iframe
                      className="w-full aspect-video rounded"
                      src={`https://www.youtube.com/embed/${id}`}
                      title={t.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <p className="text-sm text-red-600">
                      Invalid YouTube link. Please contact admin.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
