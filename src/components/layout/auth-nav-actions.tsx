"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, UserCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthNavActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong during logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-10 w-20 animate-pulse rounded-xl bg-muted" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-xl px-4 py-2 text-sm font-semibold transition hover:bg-muted"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-xl bg-[#176B45] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#125638]"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 transition hover:bg-muted"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Profile"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle size={25} />
        )}

        <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
          {user.name}
        </span>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
      >
        {loggingOut ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}