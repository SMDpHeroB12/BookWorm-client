import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-amber-200/60 bg-amber-50/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-semibold">
            <span className="text-amber-700">Book</span>Worm
          </p>
          <p className="text-gray-600 mt-2">
            Cozy reading, smart tracking, better habits.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold">Links</p>
          <Link
            className="block text-gray-600 hover:text-amber-800"
            href="/tutorials"
          >
            Tutorials
          </Link>
          <Link
            className="block text-gray-600 hover:text-amber-800"
            href="/my-library"
          >
            My Library
          </Link>
        </div>

        <div className="space-y-2">
          <p className="font-semibold">Socials</p>
          <a className="block text-gray-600 hover:text-amber-800" href="#">
            Facebook
          </a>
          <a className="block text-gray-600 hover:text-amber-800" href="#">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 pb-6">
        © {new Date().getFullYear()} BookWorm. All rights reserved.
      </div>
    </footer>
  );
}
