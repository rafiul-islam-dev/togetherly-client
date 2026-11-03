
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Event = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
};

export default function EventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setIsLoaded(false);
        setError("");

        const response = await fetch(
          `${API_URL}/api/events?page=1&limit=6`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Unable to load upcoming events.");
        }

        const result = await response.json();

        const events: Event[] = Array.isArray(result.events)
          ? result.events
          : [];

        const now = new Date();

        const filteredEvents = events
          .filter((event) => new Date(event.date) > now)
          .sort(
            (a, b) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          )
          .slice(0, 6);

        setUpcomingEvents(filteredEvents);
      } catch (err) {
        console.error("Homepage events error:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setIsLoaded(true);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
              Make An Impact
            </span>

            <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
              Upcoming Events
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">
              Find your next opportunity to make a difference in
              your local community.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-bold transition hover:bg-[var(--secondary)]"
          >
            View All Events <ArrowRight size={17} />
          </Link>
        </div>

        {!isLoaded ? (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[470px] animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--secondary)]"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-center text-red-500">
            {error}
          </p>
        ) : (
          <>
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-green-800 shadow">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex min-h-[250px] flex-col p-6">
                    <h3 className="text-xl font-bold leading-snug">
                      {event.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
                      <p className="flex items-center gap-2">
                        <MapPin size={17} className="text-green-700" />
                        {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={17} className="text-green-700" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#176B45] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#105637]"
                    >
                      View Event <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <p className="py-12 text-center text-[var(--muted)]">
                No upcoming events at the moment.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
