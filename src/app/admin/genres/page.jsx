"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminGenresPage() {
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGenres = async () => {
    const res = await fetch(`${API_BASE_URL}/api/genres`);
    const data = await res.json();
    setGenres(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const createGenre = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login again");

    const res = await fetch(`${API_BASE_URL}/api/genres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    setName("");
    fetchGenres();
  };

  const startEdit = (g) => {
    setEditing(g._id);
    setName(g.name);
  };

  const saveEdit = async () => {
    if (!token) return alert("Please login again");

    const res = await fetch(`${API_BASE_URL}/api/genres/${editing}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    setEditing(null);
    setName("");
    fetchGenres();
  };

  const remove = async (id) => {
    if (!token) return alert("Please login again");
    if (!confirm("Delete this genre?")) return;

    const res = await fetch(`${API_BASE_URL}/api/genres/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    fetchGenres();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Genres</h1>

        <form onSubmit={createGenre} className="border rounded p-4 space-y-2">
          <input
            className="w-full border p-2"
            placeholder="Genre name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setName("");
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="bg-black text-white px-4 py-2 rounded">
                Add Genre
              </button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          {genres.map((g) => (
            <div
              key={g._id}
              className="border rounded p-3 flex items-center justify-between"
            >
              <span>{g.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(g)}
                  className="border px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(g._id)}
                  className="border px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
