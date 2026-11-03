
"use client";

import AuthNavActions from "./auth-nav-actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  HeartHandshake,
  Menu,
  X,
  Sun,
  Moon,
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

  const closeMenu = () => setOpen(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Upcoming Events", href: "/events" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B45] text-white">
            <HeartHandshake size={24} />
          </span>

          <span className="text-2xl font-extrabold tracking-tight">
            Togetherly<span className="text-[#65A875]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
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

          <AuthNavActions />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] p-5 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="font-medium text-[var(--foreground)] transition hover:text-[#176B45]"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Theme Toggle */}
            <button
              type="button"
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

            {/* Mobile Authentication Actions */}
            <div className="border-t border-[var(--border)] pt-4">
              <AuthNavActions />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
