
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            <Sparkles size={16} />
            Make Every Action Count
          </div>

          <h1 className="mt-7 text-5xl font-extrabold leading-[1.12] tracking-tight md:text-6xl lg:text-7xl">
            Together, We Can
            <span className="mt-2 block text-[#287B50]">
              Change Lives.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
            Real change begins with people like you. Discover meaningful
            community events, meet passionate volunteers, and turn small
            acts of kindness into something extraordinary.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 rounded-full bg-[#176B45] px-7 py-4 font-semibold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-1 hover:bg-[#105637]"
            >
              Explore Events <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-[var(--border)] px-7 py-4 font-semibold transition hover:bg-[var(--secondary)]"
            >
              Become a Volunteer
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "photo-1534528741775-53994a69daeb",
                "photo-1500648767791-00dcc994a43e",
                "photo-1531123897727-8f129e1688ce",
                "photo-1506794778202-cad84cf45f1d",
              ].map((photo) => (
                <img
                  key={photo}
                  src={`https://images.unsplash.com/${photo}?w=80&h=80&fit=crop&crop=faces`}
                  alt="Community volunteer"
                  className="h-10 w-10 rounded-full border-2 border-[var(--background)] object-cover"
                />
              ))}
            </div>

            <div>
              <p className="text-sm font-bold">People make the difference</p>
              <p className="text-xs text-[var(--muted)]">
                Start making an impact today
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#C8EF76]/40 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-[#DCEBDD] dark:bg-[#263D30]">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&auto=format&fit=crop"
              alt="Volunteers working together for their community"
              className="h-[420px] w-full object-cover md:h-[540px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/90 p-5 text-gray-900 shadow-xl backdrop-blur-md dark:bg-[#17251d]/90 dark:text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
                    Community First
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    Together is better.
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C8EF76] text-green-900">
                  <Heart size={23} />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-5 top-16 hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl sm:block">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <Users size={23} />
              </div>
              <div>
                <p className="text-xl font-extrabold">One Mission</p>
                <p className="text-xs text-[var(--muted)]">
                  Many helping hands
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/2 hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl sm:block">
            <div className="flex items-center gap-2">
              <MapPin className="text-green-700" size={20} />
              <span className="text-sm font-bold">Start locally</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
