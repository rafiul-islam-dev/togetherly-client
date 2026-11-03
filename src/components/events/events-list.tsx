
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Search,
  SlidersHorizontal,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { EventCardSkeleton } from "@/components/shared/loading-skeleton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
};

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
};

const categories = [
  "All Categories",
  "Environment",
  "Education",
  "Community",
  "Health",
  "Animal Welfare",
  "Other",
];

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function EventsList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("All Categories");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "6",
        });

        if (search) params.set("search", search);
        if (category) params.set("category", category);

        const response = await fetch(
          `${API_URL}/api/events?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load events.");
        }

        const eventData = result.events ?? result.data ?? [];

        setEvents(Array.isArray(eventData) ? eventData : []);

        const paginationData = result.pagination;

        setPagination({
          page: paginationData?.page ?? page,
          totalPages: paginationData?.totalPages ?? 1,
          total: paginationData?.total ?? eventData.length,
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading events."
        );

        setEvents([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    return () => controller.abort();
  }, [page, search, category, retry]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    setCategory(
      categoryInput === "All Categories" ? "" : categoryInput
    );
  };

  const handleReset = () => {
    setSearchInput("");
    setCategoryInput("All Categories");
    setSearch("");
    setCategory("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-[#176B45]/5">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-[#176B45]/10 px-3 py-1.5 text-sm font-semibold text-[#176B45]">
              Discover & Participate
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Upcoming Events
            </h1>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Find meaningful activities, meet like-minded people, and
              make a positive difference in your community.
            </p>

            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125638]"
            >
              <PlusCircle size={18} />
              Create an Event
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_220px_auto_auto] sm:items-center"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search events..."
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/15"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <select
              value={categoryInput}
              onChange={(event) => setCategoryInput(event.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-9 pr-3 text-sm outline-none focus:border-[#176B45]"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125638]"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Reset
          </button>
        </form>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Explore Community Events
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading
                ? "Finding events..."
                : `${pagination.total} event${pagination.total === 1 ? "" : "s"} found`}
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <EventCardSkeleton count={6} />
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="font-semibold text-red-600">
              Could not load events
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetry((current) => current + 1)}
              className="mt-4 rounded-lg bg-[#176B45] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-5 py-16 text-center">
            <CalendarDays
              size={36}
              className="mx-auto text-muted-foreground"
            />

            <h3 className="mt-4 text-lg font-bold text-foreground">
              No events found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search or category, or create a new community event.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-5 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#176B45]">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-foreground">
                      {event.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-[#176B45]"
                        />
                        {formatDate(event.date)}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="shrink-0 text-[#176B45]"
                        />
                        <span className="line-clamp-1">
                          {event.location}
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#176B45]/30 px-4 py-3 text-sm font-semibold text-[#176B45] transition hover:bg-[#176B45] hover:text-white"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
