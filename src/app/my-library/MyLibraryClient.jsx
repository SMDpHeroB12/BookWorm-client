"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";

export default function MyLibraryClient() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Library</h1>

        <div className="grid grid-cols-2 gap-4">
          {books.map((book) => (
            <Link key={book._id} href={`/books/${book._id}`}>
              <div className="border p-2 max-w-80 rounded">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  width={300}
                  height={450}
                  className="w-full h-auto"
                />
                <h2 className="font-semibold mt-2">{book.title}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
