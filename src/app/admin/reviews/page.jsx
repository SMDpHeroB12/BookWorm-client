"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchPending = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    fetchPending();
  };

  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;

    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    fetchPending();
  };

  return (
    <ProtectedRoute role="admin">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Pending Reviews</h1>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-600">No pending reviews.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border rounded p-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Book:</span> {r.bookId?.title}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">User:</span> {r.userId?.email}
              </p>
              <p className="font-semibold">{r.rating} ★</p>
              <p>{r.comment}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => approve(r._id)}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => remove(r._id)}
                  className="border px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </ProtectedRoute>
  );
}
