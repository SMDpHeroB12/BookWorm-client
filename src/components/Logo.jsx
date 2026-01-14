import Link from "next/link";
import React from "react";

export default function Logo({ href = "/", onClick }) {
  return (
    <div>
      <Link
        href={href}
        className="font-semibold tracking-tight text-2xl"
        onClick={onClick}
      >
        <span className="text-amber-700">Book</span>
        <span className="text-gray-900">Worm</span>
      </Link>
    </div>
  );
}
