
import Link from "next/link";
import { ArrowRight, HeartHandshake, Users, CalendarDays } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <HeartHandshake className="text-green-700" size={30} />
          <span>Togetherly</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/events" className="hidden sm:block text-sm font-medium">
            Upcoming Events
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-green-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
          >
            Login
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            <HeartHandshake size={16} />
            Together, We Make a Difference
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Small Actions.
            <span className="block text-green-700">
              Stronger Communities.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Connect with people who care. Discover local volunteering
            opportunities, join community events, and help build a
            better tomorrow.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-green-800 px-7 py-4 font-semibold text-white transition hover:bg-green-900"
            >
              Explore Events <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-green-800 px-7 py-4 font-semibold text-green-800 transition hover:bg-green-50"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="flex min-h-[400px] flex-col justify-between rounded-[2rem] bg-green-800 p-8 text-white shadow-xl md:min-h-[480px]">
            <div>
              <p className="text-sm font-medium text-green-200">
                THE POWER OF COMMUNITY
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight">
                Better together, stronger forever.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-5">
                <Users size={28} className="text-lime-300" />
                <p className="mt-4 text-2xl font-bold">Community</p>
                <p className="mt-1 text-sm text-green-100">
                  People helping people
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <CalendarDays size={28} className="text-lime-300" />
                <p className="mt-4 text-2xl font-bold">Events</p>
                <p className="mt-1 text-sm text-green-100">
                  Actions that matter
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Togetherly. Small actions, stronger communities.
      </footer>
    </main>
  );
}
