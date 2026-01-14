"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Shelf feedback
  const [shelfLoading, setShelfLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchReviews = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/books/${id}`);
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE_URL}/api/books/${id}`)
      .then((res) => res.json())
      .then(setBook);

    fetchReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login to review");

    const res = await fetch(`${API_BASE_URL}/api/reviews/books/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: Number(rating), comment }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");

    setComment("");
    setRating(5);
    alert("Review submitted for moderation ✅");
  };

  // ✅ Add to shelf (Want / Current / Read)
  const addToShelf = async (shelf) => {
    if (!token) return alert("Please login first");
    if (!id) return;

    setShelfLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookId: id,
        shelf,
        progress: shelf === "read" ? 100 : 0,
      }),
    });

    const data = await res.json();
    setShelfLoading(false);

    if (!res.ok) return alert(data.message || "Failed to add to shelf");
    alert("Added to your library ✅");
  };

  if (!book) return <p className="p-4">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Top section */}
        <Card className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover */}
            <div className="flex justify-center md:justify-start">
              <Image
                src={book.coverImage}
                alt={book.title}
                width={360}
                height={520}
                className="w-full max-w-[320px] md:max-w-90 h-auto rounded-2xl border border-amber-200/60 shadow-sm"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                  {book.genre}
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {book.title}
                </h1>

                <p className="text-gray-700">
                  by <span className="font-semibold">{book.author}</span>
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>

              {/* ✅ Add to Shelf Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  Add to shelf
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={shelfLoading}
                    onClick={() => addToShelf("want")}
                    className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50 disabled:opacity-50"
                  >
                    Want to Read
                  </button>

                  <button
                    disabled={shelfLoading}
                    onClick={() => addToShelf("current")}
                    className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm hover:bg-amber-50 disabled:opacity-50"
                  >
                    Currently Reading
                  </button>

                  <button
                    disabled={shelfLoading}
                    onClick={() => addToShelf("read")}
                    className="rounded-xl bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800 disabled:opacity-50"
                  >
                    Mark as Read
                  </button>
                </div>

                {shelfLoading && (
                  <p className="text-xs text-gray-600">Saving...</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Submit Review */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Write a Review
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Your review will be visible after admin approval.
            </p>

            <form onSubmit={submitReview} className="mt-4 space-y-3">
              <select
                className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star
                  </option>
                ))}
              </select>

              <textarea
                className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button className="w-full rounded-xl bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800">
                Submit Review (Pending)
              </button>
            </form>
          </Card>

          {/* Approved Reviews */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
            <p className="text-sm text-gray-600 mt-1">
              Only approved reviews are shown here.
            </p>

            <div className="mt-4 space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No approved reviews yet.
                </p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r._id}
                    className="rounded-2xl border border-amber-200/70 bg-white/80 p-4"
                  >
                    <p className="font-semibold text-gray-900">{r.rating} ★</p>
                    <p className="text-gray-700 mt-1">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
