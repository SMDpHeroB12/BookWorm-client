"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { confirmAction } from "@/lib/confirm";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminGenresPage() {
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/genres`);
      const data = await res.json();
      setGenres(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load genres");
      setGenres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const addGenre = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Genre name required");
    if (!token) return toast.error("No token found. Please login again.");

    try {
      setWorking(true);
      const res = await fetch(`${API_BASE_URL}/api/genres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Genre added ✅");
      setName("");
      fetchGenres();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setWorking(false);
    }
  };

  const editGenre = async (g) => {
    const nextName = prompt("Edit genre name:", g.name);
    if (!nextName || !nextName.trim()) return;

    const ok = await confirmAction({
      title: "Update this genre?",
      text: `Change "${g.name}" to "${nextName.trim()}"`,
      confirmText: "Update",
      icon: "question",
    });
    if (!ok) return;

    try {
      setWorking(true);
      const res = await fetch(`${API_BASE_URL}/api/genres/${g._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nextName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Genre updated ✅");
      fetchGenres();
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
          Manage Genres
        </h1>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Add new genre</h2>

          <form
            onSubmit={addGenre}
            className="mt-3 flex flex-col sm:flex-row gap-2"
          >
            <Input
              placeholder="Genre name (e.g. Self-help)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button className="w-[40%]" disabled={working}>
              {working ? "Saving..." : "Add Genre"}
            </Button>
          </form>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold">All genres</h2>

          <div className="mt-3">
            {loading ? (
              <LoadingSpinner label="Loading genres..." />
            ) : genres.length === 0 ? (
              <p className="text-sm text-gray-600">No genres found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {genres.map((g) => (
                  <div
                    key={g._id}
                    className="rounded-2xl border border-amber-200/70 bg-white/80 p-4 flex items-center justify-between gap-3"
                  >
                    <p className="font-semibold">{g.name}</p>
                    <button
                      onClick={() => editGenre(g)}
                      className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm hover:bg-amber-50"
                      disabled={working}
                    >
                      Edit
                    </button>
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
