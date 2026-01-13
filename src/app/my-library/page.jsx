"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyLibrary() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-2 gap-4">
        {books.map((book) => (
          <Link key={book._id} href={`/books/${book._id}`}>
            <div className="border p-2">
              <img src={book.coverImage} />
              <h2 className="font-semibold">{book.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </ProtectedRoute>
  );
}
