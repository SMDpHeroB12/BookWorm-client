"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "https://placehold.co/300x450",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/books`);
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // Fetch all genres
  const fetchGenres = async () => {
    const res = await fetch(`${API_BASE_URL}/api/genres`);
    const data = await res.json();
    setGenres(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setForm({
      title: "",
      author: "",
      genre: "",
      description: "",
      coverImage: "https://placehold.co/300x450",
    });
  };

  const startEdit = (book) => {
    setMode("edit");
    setEditingId(book._id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      description: book.description || "",
      coverImage: book.coverImage || "https://placehold.co/300x450",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return alert("No token found. Please login again.");

    const url =
      mode === "create"
        ? `${API_BASE_URL}/api/books`
        : `${API_BASE_URL}/api/books/${editingId}`;

    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Request failed");

    await fetchBooks();
    resetForm();
    alert(mode === "create" ? "Book added ✅" : "Book updated ✅");
  };

  const remove = async (id) => {
    if (!token) return alert("No token found. Please login again.");
    const ok = confirm("Delete this book?");
    if (!ok) return;

    const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Delete failed");

    await fetchBooks();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-6 ">
        <div>
          <h1 className="text-2xl font-bold">Manage Books</h1>
          <p className="text-sm text-gray-600">
            Add, edit, or delete books (admin only).
          </p>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={submit} className="border rounded p-4 space-y-3">
          <h2 className="font-semibold">
            {mode === "create" ? "Add New Book" : "Edit Book"}
          </h2>

          <input
            className="w-full border p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
          />

          <input
            className="w-full border p-2"
            placeholder="Author"
            value={form.author}
            onChange={(e) => onChange("author", e.target.value)}
          />

          <select
            className="w-full border p-2"
            value={form.genre}
            onChange={(e) => onChange("genre", e.target.value)}
          >
            <option value="">Select genre</option>
            {genres.map((g) => (
              <option key={g._id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            className="w-full border p-2"
            placeholder="Cover Image URL"
            value={form.coverImage}
            onChange={(e) => onChange("coverImage", e.target.value)}
          />

          <textarea
            className="w-full border p-2 min-h-30"
            placeholder="Description"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
          />

          <div className="flex items-center gap-2">
            <button className="bg-black text-white px-4 py-2 rounded">
              {mode === "create" ? "Add Book" : "Update Book"}
            </button>

            {mode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Books List */}
        <div className="space-y-3">
          <h2 className="font-semibold">All Books</h2>

          <div className="">
            {loading ? (
              <p>Loading...</p>
            ) : books.length === 0 ? (
              <p className="text-sm text-gray-600">No books found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((b) => (
                  <div key={b._id} className="border rounded p-3 space-y-2">
                    <Image
                      src={b.coverImage}
                      alt={b.title}
                      width={300}
                      height={450}
                      className="w-full h-auto rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{b.title}</h3>
                      <p className="text-sm text-gray-600">{b.author}</p>
                      <p className="text-sm text-gray-600">Genre: {b.genre}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(b)}
                        className="border px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(b._id)}
                        className="border px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
