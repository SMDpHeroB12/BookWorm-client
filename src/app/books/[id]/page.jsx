"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/books/${id}`)
      .then((res) => res.json())
      .then(setBook);
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="max-w-md space-y-4">
      <Image
        src={book.coverImage}
        alt={book.title}
        width={300}
        height={450}
        className="w-full"
      />

      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p className="text-gray-600">{book.author}</p>
      <p>{book.description}</p>
    </div>
  );
}
