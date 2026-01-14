"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { confirmAction } from "@/lib/confirm";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function getYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return u.pathname.replace("/", "") || "";
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("embed");
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    return "";
  } catch {
    return "";
  }
}

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // UI keep (backend may ignore)
  const [videoUrl, setVideoUrl] = useState(""); // UI input value

  // ✅ Edit system (same page)
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/tutorials`);
      const data = await res.json();
      setTutorials(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load tutorials");
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const embedId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setMode("create");
    setEditingId(null);
  };

  const startEdit = (t) => {
    setMode("edit");
    setEditingId(t._id);

    setTitle(t.title || "");
    setDescription(t.description || ""); // if backend doesn't store, it'll be empty
    setVideoUrl(t.youtubeUrl || ""); // ✅ backend field name

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createOrUpdateTutorial = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!title.trim()) return toast.error("Title required");
    if (!videoUrl.trim()) return toast.error("YouTube link required");
    if (!getYouTubeId(videoUrl.trim()))
      return toast.error("Invalid YouTube URL");
    if (!token) return toast.error("No token found. Please login again.");

    // ✅ Confirm only for update (SweetAlert2)
    if (mode === "edit") {
      const ok = await confirmAction({
        title: "Update this tutorial?",
        text: "Changes will be saved immediately.",
        confirmText: "Update",
        icon: "question",
      });
      if (!ok) return;
    }

    try {
      setWorking(true);

      const url =
        mode === "create"
          ? `${API_BASE_URL}/api/tutorials`
          : `${API_BASE_URL}/api/tutorials/${editingId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          youtubeUrl: videoUrl.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success(
        mode === "create" ? "Tutorial added ✅" : "Tutorial updated ✅"
      );

      resetForm();
      fetchTutorials();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setWorking(false);
    }
  };

  const remove = async (id) => {
    const ok = await confirmAction({
      title: "Delete this tutorial?",
      text: "This will remove the tutorial from the list.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      setWorking(true);
      const res = await fetch(`${API_BASE_URL}/api/tutorials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Tutorial deleted ✅");
      fetchTutorials();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setWorking(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Manage Tutorials
        </h1>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">
              {mode === "create" ? "Add tutorial" : "Edit tutorial"}
            </h2>

            {mode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50 disabled:opacity-50"
                disabled={working}
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={createOrUpdateTutorial} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Tutorial title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="YouTube link (watch / youtu.be / embed)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <textarea
              className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm min-h-[100px]"
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {embedId && (
              <div className="rounded-2xl border border-amber-200/70 overflow-hidden bg-white">
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${embedId}`}
                    title="Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <Button disabled={working}>
              {working
                ? "Saving..."
                : mode === "create"
                ? "Add Tutorial"
                : "Update"}
            </Button>
          </form>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold">All tutorials</h2>

          <div className="mt-3">
            {loading ? (
              <LoadingSpinner label="Loading tutorials..." />
            ) : tutorials.length === 0 ? (
              <p className="text-sm text-gray-600">No tutorials found.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tutorials.map((t) => (
                  <div
                    key={t._id}
                    className="rounded-2xl border border-amber-200/70 bg-white/80 p-4 space-y-2"
                  >
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-sm text-gray-600 break-all">
                      {t.youtubeUrl}
                    </p>
                    {t.description ? (
                      <p className="text-sm text-gray-600">{t.description}</p>
                    ) : null}

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        disabled={working}
                        className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50 disabled:opacity-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => remove(t._id)}
                        disabled={working}
                        className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
