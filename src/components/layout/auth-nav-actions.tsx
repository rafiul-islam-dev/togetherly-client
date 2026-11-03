
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, User, CalendarPlus, CalendarDays, Users, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AuthNavActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  // Close dropdown when session changes
  useEffect(() => {
    setMenuOpen(false);
  }, [session?.user?.id]);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setMenuOpen(false);
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong during logout.");
    }
  };

  if (isPending) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
    );
  }

  // User is not logged in
  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Login
      </Link>
    );
  }

  const user = session.user;
  const userName = user.name || "User";
  const userImage = user.image;

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Picture Trigger */}
      <button
        type="button"
        onClick={() => setMenuOpen((previous) => !previous)}
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="group relative flex items-center gap-2 rounded-full border border-border bg-card p-1.5 transition hover:border-primary/50 hover:bg-muted"
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials || "U"}
          </span>
        )}

        <ChevronDown
          className={`mr-1 h-4 w-4 transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />

        {/* Display Name Tooltip */}
        <span className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-md group-hover:block group-focus-visible:block">
          {userName}
        </span>
      </button>

      {/* Profile Dropdown */}
      <div
        role="menu"
        aria-label="Profile navigation"
        className={`absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-border bg-card p-2 shadow-xl transition-all duration-200 ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        {/* User Information */}
        <div className="border-b border-border px-3 py-3">
          <p className="truncate text-sm font-semibold text-foreground">
            {userName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>

        {/* Dropdown Links */}
        <div className="space-y-1 py-2">
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-muted"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            My Profile
          </Link>

          <Link
            href="/create-event"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-muted"
          >
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
            Create Event
          </Link>

          <Link
            href="/manage-events"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-muted"
          >
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Manage Events
          </Link>

          <Link
            href="/joined-events"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-muted"
          >
            <Users className="h-4 w-4 text-muted-foreground" />
            Joined Events
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-border pt-2">
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
