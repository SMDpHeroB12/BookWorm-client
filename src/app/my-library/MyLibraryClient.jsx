"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";
import Card from "@/components/ui/Card";

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <Link key={book._id} href={`/books/${book._id}`}>
              <Card>
                <div className=" p-2 max-w-80">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={300}
                    height={450}
                    className="w-full h-[450px] object-contain rounded-md"
                  />
                  <h2 className="font-semibold mt-2">{book.title}</h2>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
