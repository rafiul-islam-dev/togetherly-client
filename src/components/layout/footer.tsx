
import Link from "next/link";
import { HeartHandshake, ArrowUpRight } from "lucide-react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M5.2 3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9h3.8v12H3.3V9Zm6.2 0h3.6v1.6h.1c.5-.9 1.7-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-3.8v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9.5V9Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.8 2h6.4l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <InstagramIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <LinkedinIcon />,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: <XIcon />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--secondary)]/50">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B45] text-white">
                <HeartHandshake size={24} />
              </span>

              <span className="text-2xl font-extrabold">
                Togetherly<span className="text-green-600">.</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm leading-7 text-[var(--muted)]">
              Bringing people together to create meaningful
              change through community service and volunteering.
            </p>

            <div className="mt-7 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition hover:bg-[#176B45] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold">Explore</h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-green-700">
                Home
              </Link>
              <Link href="/events" className="hover:text-green-700">
                Upcoming Events
              </Link>
              <Link href="/about" className="hover:text-green-700">
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Get Involved</h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-[var(--muted)]">
              <Link href="/register" className="hover:text-green-700">
                Become a Volunteer
              </Link>
              <Link href="/login" className="hover:text-green-700">
                Log In
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 hover:text-green-700"
              >
                Find Events <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-[var(--border)] pt-7 text-sm text-[var(--muted)] sm:flex-row">
          <p>
            © 2026 Togetherly. All rights reserved.
          </p>

          <p>
            Made with care for stronger communities.{" "}
            <span className="text-red-500">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
