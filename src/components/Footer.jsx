import Link from "next/link";
import Logo from "./Logo";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-amber-200/60 bg-amber-50/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <Logo />
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

          <div className="flex items-center gap-1">
            <FaFacebookSquare />
            <Link
              target="_blank"
              className="block text-gray-600 hover:text-amber-800"
              href="https://facebook.com/shekhmdnayem"
            >
              Facebook
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <FaXTwitter />
            <Link
              target="_blank"
              className="block text-gray-600 hover:text-amber-800"
              href="https://twitter.com/shekhmdnayem"
            >
              Twitter(X)
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <FaLinkedin />
            <Link
              target="_blank"
              className="block text-gray-600 hover:text-amber-800"
              href="https://www.linkedin.com/in/shekhmdnayem/"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-600 pb-6">
        © {new Date().getFullYear()} BookWorm. All rights reserved.
      </div>
    </footer>
  );
}
