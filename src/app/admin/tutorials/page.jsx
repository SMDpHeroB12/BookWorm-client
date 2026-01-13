"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState([]);
  const [form, setForm] = useState({ title: "", youtubeUrl: "" });
  const [editingId, setEditingId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTutorials = async () => {
    const res = await fetch(`${API_BASE_URL}/api/tutorials`);
    const data = await res.json();
    setTutorials(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const reset = () => {
    setEditingId(null);
    setForm({ title: "", youtubeUrl: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login again");

    const url = editingId
      ? `${API_BASE_URL}/api/tutorials/${editingId}`
      : `${API_BASE_URL}/api/tutorials`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");

    await fetchTutorials();
    reset();
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setForm({ title: t.title, youtubeUrl: t.youtubeUrl });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!token) return alert("Please login again");
    if (!confirm("Delete this tutorial?")) return;

    const res = await fetch(`${API_BASE_URL}/api/tutorials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");

    fetchTutorials();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Tutorials</h1>

        <form onSubmit={submit} className="border rounded p-4 space-y-2">
          <h2 className="font-semibold">
            {editingId ? "Edit Tutorial" : "Add Tutorial"}
          </h2>

          <input
            className="w-full border p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="w-full border p-2"
            placeholder="YouTube URL (full link)"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
          />

          <div className="flex gap-2">
            <button className="bg-black text-white px-4 py-2 rounded">
              {editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          {tutorials.length === 0 ? (
            <p className="text-sm text-gray-600">No tutorials yet.</p>
          ) : (
            tutorials.map((t) => (
              <div
                key={t._id}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-gray-600 break-all">
                    {t.youtubeUrl}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(t)}
                    className="border px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(t._id)}
                    className="border px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
