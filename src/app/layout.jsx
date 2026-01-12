import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookWorm",
  description: "Personalized Book Recommendation & Reading Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 shadow-sm p-4 font-semibold">
          <span className="text-primary">Book</span> Worm
        </header>

        <main className="flex-1 p-4">{children}</main>

        <footer className="border-t border-gray-200 p-4 text-sm text-center">
          © {new Date().getFullYear()} BookWorm
        </footer>
      </body>
    </html>
  );
}
