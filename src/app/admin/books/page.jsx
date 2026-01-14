"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { confirmAction } from "@/lib/confirm";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { isImgbbUrl } from "@/lib/validators";
import { API_BASE_URL } from "@/lib/api";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const PLACEHOLDER = "https://placehold.co/300x450/gray/FFFFFF.png";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: PLACEHOLDER,
  });

  const [imgbbUrl, setImgbbUrl] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setImgbbUrl("");
    setForm({
      title: "",
      author: "",
      genre: "",
      description: "",
      coverImage: PLACEHOLDER,
    });
  };

  const fetchBooks = async () => {
    const res = await fetch(`${API_BASE_URL}/api/books`);
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
  };

  const fetchGenres = async () => {
    const res = await fetch(`${API_BASE_URL}/api/genres`);
    const data = await res.json();
    setGenres(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    (async () => {
      try {
        setPageLoading(true);
        await Promise.all([fetchBooks(), fetchGenres()]);
      } catch {
        toast.error("Failed to load books/genres");
      } finally {
        setPageLoading(false);
      }
    })();
  }, []);

  const startEdit = (book) => {
    setMode("edit");
    setEditingId(book._id);
    setImgbbUrl("");
    setForm({
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      description: book.description || "",
      coverImage: book.coverImage || PLACEHOLDER,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyImgbbUrl = () => {
    if (!imgbbUrl.trim()) return toast.error("Paste an imgbb image URL first");
    if (!isImgbbUrl(imgbbUrl.trim())) {
      return toast.error("Only imgbb image links are allowed (i.ibb.co)");
    }
    onChange("coverImage", imgbbUrl.trim());
    toast.success("Image URL applied ✅");
  };

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      onChange("coverImage", url);
      toast.success("Cover uploaded ✅");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.author.trim()) return "Author is required";
    if (!form.genre.trim()) return "Genre is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.coverImage.trim()) return "Cover image is required";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("No token found. Please login again.");

    const err = validateForm();
    if (err) return toast.error(err);

    // SweetAlert2 confirmation for UPDATE (requirement)
    if (mode === "edit") {
      const ok = await confirmAction({
        title: "Update this book?",
        text: "Changes will be saved immediately.",
        confirmText: "Yes, update",
      });
      if (!ok) return;
    }

    try {
      setSaving(true);

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
      if (!res.ok) throw new Error(data.message || "Request failed");

      await fetchBooks();
      resetForm();

      toast.success(mode === "create" ? "Book created ✅" : "Book updated ✅");
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!token) return toast.error("No token found. Please login again.");

    // SweetAlert2 confirmation for DELETE (requirement)
    const ok = await confirmAction({
      title: "Delete this book?",
      text: "This book will be permanently removed.",
      confirmText: "Yes, delete",
    });
    if (!ok) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      await fetchBooks();
      toast.success("Book deleted ✅");
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const booksForList = useMemo(() => books, [books]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Books
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View, add, edit, and delete books (admin only).
          </p>
        </div>

        {/* Add/Edit Form */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">
              {mode === "create" ? "Add New Book" : "Edit Book"}
            </h2>

            {mode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
                disabled={saving || uploading}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form
            onSubmit={submit}
            className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-amber-200/70 bg-white/80 p-3 space-y-3">
                <Image
                  src={form.coverImage || PLACEHOLDER}
                  alt={form.title || "Cover"}
                  width={300}
                  height={450}
                  className="w-full h-auto rounded-2xl border border-amber-200/60"
                />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Cover image
                  </p>

                  {/* Cloudinary upload */}
                  <div className="space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full h-15 rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm file-input"
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                      disabled={uploading || saving}
                    />
                    {uploading && <LoadingSpinner label="Uploading cover..." />}
                  </div>

                  {/* Manual imgbb URL */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Manual Image URL (imgbb only: i.ibb.co)"
                      value={imgbbUrl}
                      onChange={(e) => setImgbbUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={applyImgbbUrl}
                        className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
                        disabled={saving || uploading}
                      >
                        Apply URL
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImgbbUrl("");
                          onChange("coverImage", PLACEHOLDER);
                        }}
                        className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
                        disabled={saving || uploading}
                      >
                        Reset cover
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Rule: manual URL must be from{" "}
                      <span className="font-semibold">imgbb (i.ibb.co)</span>.
                      Cloudinary upload is also supported.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="lg:col-span-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    placeholder="Book title"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <Input
                    value={form.author}
                    onChange={(e) => onChange("author", e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Genre
                </label>
                <select
                  className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
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
                <p className="text-xs text-gray-600">
                  Books must link to an existing genre (Requirement).
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm min-h-30 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  placeholder="Write a short description..."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="px-5" disabled={saving || uploading}>
                  {saving
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                    ? "Create Book"
                    : "Update Book"}
                </Button>

                {(saving || uploading) && (
                  <div className="flex items-center">
                    <LoadingSpinner label="Working..." />
                  </div>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Books List */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">All Books</h2>
            <p className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold">{booksForList.length}</span>
            </p>
          </div>

          <div className="mt-4">
            {pageLoading ? (
              <LoadingSpinner label="Loading books..." />
            ) : booksForList.length === 0 ? (
              <p className="text-sm text-gray-600">No books found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booksForList.map((b) => (
                  <div
                    key={b._id}
                    className="rounded-2xl border border-amber-200/70 bg-white/80 p-3 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <Image
                          src={b.coverImage || PLACEHOLDER}
                          alt={b.title}
                          width={140}
                          height={210}
                          className="w-full h-auto rounded-xl border border-amber-200/60"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <p className="font-semibold">{b.title}</p>
                        <p className="text-sm text-gray-600">{b.author}</p>
                        <p className="text-sm text-gray-600">
                          Genre: <span className="font-medium">{b.genre}</span>
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => startEdit(b)}
                            className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
                            disabled={saving || uploading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => remove(b._id)}
                            className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50"
                            disabled={saving || uploading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
