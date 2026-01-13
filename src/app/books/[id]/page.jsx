"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  if (!book) return <p className="p-4">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-md space-y-6">
        <div className="space-y-3">
          <Image
            src={book.coverImage}
            alt={book.title}
            width={300}
            height={450}
            className="w-full h-auto rounded"
          />
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600">{book.author}</p>
          <p>{book.description}</p>
        </div>

        {/* Submit Review */}
        <form onSubmit={submitReview} className="border rounded p-4 space-y-2">
          <h2 className="font-semibold">Write a Review</h2>

          <select
            className="w-full border p-2"
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
            className="w-full border p-2 min-h-25"
            placeholder="Your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            Submit (Pending)
          </button>
        </form>

        {/* Approved Reviews */}
        <div className="space-y-2">
          <h2 className="font-semibold">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-600">No approved reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border rounded p-3">
                <p className="font-semibold">{r.rating} ★</p>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
