
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  LogOut,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api";
import { EventCardSkeleton } from "@/components/shared/loading-skeleton";

type JoinedEvent = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
};

type JoinRecord = {
  _id: string;
  event: JoinedEvent | null;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function JoinedEvents() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const fetchJoinedEvents = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authenticatedFetch("/api/joins", {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load joined events.");
      }

      const records: JoinRecord[] =
        result.joins ?? result.events ?? result.data ?? [];

      const joinedEvents = records
        .map((record) => {
          return "event" in record ? record.event : record;
        })
        .filter((event): event is JoinedEvent => Boolean(event?._id))
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setEvents(joinedEvents);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your events."
      );

      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Authentication protection
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Fetch joined events
  useEffect(() => {
    if (session) {
      fetchJoinedEvents();
    }
  }, [session, fetchJoinedEvents, retry]);

  // Leave event
  const handleLeave = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this event?"
    );

    if (!confirmed) return;

    setLeavingId(eventId);

    try {
      const response = await authenticatedFetch(
        `/api/joins/${eventId}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to leave this event.");
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== eventId)
      );

      toast.success("You have left the event.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLeavingId(null);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking your account...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">

      {/* Page Header */}
      <section className="border-b border-border bg-[#176B45]/5">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#176B45]/10 px-3 py-1.5 text-sm font-semibold text-[#176B45]">
            <Users size={16} />
            Your Participation
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Joined Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep track of the community events you have joined.
            Every small action can make a meaningful difference.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Your Events
            </h2>

            {!isLoading && !error && (
              <p className="mt-1 text-sm text-muted-foreground">
                {events.length} event{events.length === 1 ? "" : "s"} joined
              </p>
            )}
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125638]"
          >
            Explore Events
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading */}
        {isLoading ? (
          <EventCardSkeleton count={6} />

        ) : error ? (

          /* Error */
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="font-semibold text-red-600">
              Could not load your events
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>

        ) : events.length === 0 ? (

          /* Empty State */
          <div className="rounded-2xl border border-dashed border-border px-5 py-16 text-center">
            <Users
              size={38}
              className="mx-auto text-muted-foreground"
            />

            <h3 className="mt-4 text-lg font-bold text-foreground">
              You haven't joined any events yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Explore upcoming community activities and join an event
              that interests you.
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Events
              <ArrowRight size={16} />
            </Link>
          </div>

        ) : (

          /* Joined Event Cards */
          <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {events.map((event) => {
              const isPast =
                new Date(event.date).getTime() <= Date.now();

              return (
                <article
                  key={event._id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
                >

                  {/* Event Image */}
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      onError={(imageEvent) => {
                        imageEvent.currentTarget.style.display = "none";
                      }}
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#176B45]">
                      {event.category}
                    </span>

                    {isPast && (
                      <span className="absolute right-4 top-4 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-5">

                    {/* Title */}
                    <h3 className="min-h-7 line-clamp-1 text-lg font-bold text-foreground">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-muted-foreground">
                      {event.description}
                    </p>

                    {/* Event Information */}
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">

                      <p className="flex min-h-5 items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="shrink-0 text-[#176B45]"
                        />

                        <span className="line-clamp-1">
                          {formatDate(event.date)}
                        </span>
                      </p>

                      <p className="flex min-h-5 items-center gap-2">
                        <MapPin
                          size={16}
                          className="shrink-0 text-[#176B45]"
                        />

                        <span className="line-clamp-1">
                          {event.location}
                        </span>
                      </p>

                    </div>

                    {/* Action Buttons - Always at Bottom */}
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-5">

                      <Link
                        href={`/events/${event._id}`}
                        className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-[#176B45]/30 px-2 py-3 text-center text-xs font-semibold text-[#176B45] transition hover:bg-[#176B45] hover:text-white"
                      >
                        View Details
                        <ArrowRight size={14} className="shrink-0" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleLeave(event._id)}
                        disabled={leavingId === event._id}
                        className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-red-500/30 px-2 py-3 text-center text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {leavingId === event._id ? (
                          <LoaderCircle
                            size={14}
                            className="shrink-0 animate-spin"
                          />
                        ) : (
                          <LogOut size={14} className="shrink-0" />
                        )}

                        Leave Event
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}

          </div>
        )}
      </section>
    </main>
  );
}
