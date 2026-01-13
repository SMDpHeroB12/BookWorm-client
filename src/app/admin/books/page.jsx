"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

export default function AdminBooks() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    alert("Book added");
  };

  return (
    <ProtectedRoute role="admin">
      <div className="max-w-md space-y-3">
        <h1 className="text-xl font-bold">Add Book</h1>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            className="w-full border p-2"
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <button onClick={handleSubmit} className="bg-black text-white p-2">
          Save
        </button>
      </div>
    </ProtectedRoute>
  );
}
