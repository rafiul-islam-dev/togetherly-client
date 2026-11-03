
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  HeartHandshake,
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Upcoming Events", href: "/events" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B45] text-white">
            <HeartHandshake size={24} />
          </span>

          <span className="text-2xl font-extrabold tracking-tight">
            Togetherly<span className="text-[#65A875]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[#176B45]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition hover:bg-[var(--secondary)]"
          >
            {!mounted ? (
              <Sun size={18} />
            ) : theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Link
            href="/login"
            className="rounded-full px-5 py-3 text-sm font-semibold transition hover:bg-[var(--secondary)]"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#176B45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#105637]"
          >
            Get Started <ArrowUpRight size={16} />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] p-5 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-medium"
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-left font-medium"
            >
              {mounted && theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
              Change Theme
            </button>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#176B45] px-5 py-3 text-center font-semibold text-white"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-full border border-[var(--border)] px-5 py-3 text-center font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
