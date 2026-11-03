
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  LogIn,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api";

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

type JoinItem = {
  event?: string | { _id?: string };
  eventId?: string;
};

export default function EventDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isCheckingJoinStatus, setIsCheckingJoinStatus] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState("");

  // Fetch event details
  useEffect(() => {
    if (!eventId) return;

    const controller = new AbortController();

    const fetchEvent = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/events/${eventId}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load this event.");
        }

        const eventData = result.event ?? result.data ?? result;

        if (!eventData?._id) {
          throw new Error("Event information was not found.");
        }

        setEvent(eventData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvent();

    return () => controller.abort();
  }, [eventId]);

  // Check whether the logged-in user has already joined this event
  useEffect(() => {
    if (isSessionPending || !eventId) return;

    if (!session) {
      setHasJoined(false);
      setIsCheckingJoinStatus(false);
      return;
    }

    const controller = new AbortController();

    const checkJoinStatus = async () => {
      setIsCheckingJoinStatus(true);

      try {
        const response = await authenticatedFetch("/api/joins", {
          method: "GET",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to check join status.");
        }

        const joins: JoinItem[] =
          result.joins ?? result.events ?? result.data ?? [];

        const alreadyJoined = Array.isArray(joins)
          ? joins.some((join) => {
              const joinedEvent =
                typeof join.event === "object"
                  ? join.event?._id
                  : join.event;

              const joinedEventId = joinedEvent ?? join.eventId;

              return String(joinedEventId) === String(eventId);
            })
          : false;

        if (!controller.signal.aborted) {
          setHasJoined(alreadyJoined);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Join status error:", err);
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingJoinStatus(false);
        }
      }
    };

    checkJoinStatus();

    return () => controller.abort();
  }, [eventId, session?.user?.email, isSessionPending]);

  // Join event
  const handleJoin = async () => {
    if (!session) {
      toast.error("Please log in to join this event.");
      router.push("/login");
      return;
    }

    if (!event || hasJoined) return;

    setIsJoining(true);

    try {
      const response = await authenticatedFetch(
        `/api/joins/${event._id}`,
        { method: "POST" }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setHasJoined(true);
        }

        throw new Error(result.message || "Unable to join this event.");
      }

      setHasJoined(true);
      toast.success("You have successfully joined this event!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading || isSessionPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle className="animate-spin" size={20} />
          Loading event details...
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Event not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error || "This event may have been removed or is unavailable."}
        </p>

        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={17} />
          Back to Events
        </Link>
      </main>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate.getTime() <= Date.now();

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-[#176B45]"
        >
          <ArrowLeft size={17} />
          Back to Events
        </Link>

        <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative aspect-[16/9] max-h-[520px] overflow-hidden bg-muted">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
              onError={(imageEvent) => {
                imageEvent.currentTarget.style.display = "none";
              }}
            />

            <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#176B45]">
              {event.category}
            </span>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {event.title}
            </h1>

            <div className="mt-6 grid gap-4 rounded-2xl bg-muted/50 p-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={21}
                  className="mt-0.5 shrink-0 text-[#176B45]"
                />

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Date & Time
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {eventDate.toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={21}
                  className="mt-0.5 shrink-0 text-[#176B45]"
                />

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-bold text-foreground">
                About This Event
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                {event.description}
              </p>
            </section>

            <div className="mt-9 border-t border-border pt-7">
              {isCheckingJoinStatus ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-muted px-5 py-4 text-sm font-semibold text-muted-foreground">
                  <LoaderCircle size={18} className="animate-spin" />
                  Checking participation...
                </div>
              ) : hasJoined ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#176B45]/10 px-5 py-4 text-sm font-semibold text-[#176B45]">
                  <CheckCircle2 size={19} />
                  You have joined this event
                </div>
              ) : isPastEvent ? (
                <div className="rounded-xl bg-muted px-5 py-4 text-center text-sm font-semibold text-muted-foreground">
                  This event has already taken place.
                </div>
              ) : session ? (
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isJoining ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Joining Event...
                    </>
                  ) : (
                    <>
                      <Users size={18} />
                      Join This Event
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#125638]"
                >
                  <LogIn size={18} />
                  Login to Join This Event
                </Link>
              )}

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Be part of something meaningful in your community.
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
