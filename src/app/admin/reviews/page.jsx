"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { confirmAction } from "@/lib/confirm";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/reviews/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load pending reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    const ok = await confirmAction({
      title: "Approve this review?",
      text: "Once approved, it will be visible on the book details page.",
      confirmText: "Approve",
      icon: "question",
    });
    if (!ok) return;

    try {
      setWorkingId(id);
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Review approved ✅");
      fetchPending();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setWorkingId(null);
    }
  };

  const remove = async (id) => {
    const ok = await confirmAction({
      title: "Delete this review?",
      text: "This review will be permanently removed.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      setWorkingId(id);
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Review deleted ✅");
      fetchPending();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Moderate Reviews
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Approve or delete pending reviews (admin only).
          </p>
        </div>

        <Card className="p-4 sm:p-6">
          {loading ? (
            <LoadingSpinner label="Loading pending reviews..." />
          ) : reviews.length === 0 ? (
            <p className="text-sm text-gray-600">No pending reviews.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="rounded-2xl border border-amber-200/70 bg-white/80 p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Book:{" "}
                      <span className="font-semibold text-gray-900">
                        {r.bookId?.title || "Unknown"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      User:{" "}
                      <span className="font-semibold text-gray-900 break-words">
                        {r.userId?.email || r.userId?.name || "Unknown"}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-900">{r.rating} ★</p>
                    <p className="text-gray-700">{r.comment}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => approve(r._id)}
                      disabled={workingId === r._id}
                      className="rounded-xl bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800 disabled:opacity-50"
                    >
                      {workingId === r._id ? "Working..." : "Approve"}
                    </button>

                    <button
                      onClick={() => remove(r._id)}
                      disabled={workingId === r._id}
                      className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50 disabled:opacity-50"
                    >
                      Delete
                    </button>

                    {workingId === r._id && (
                      <LoadingSpinner label="Updating..." />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
