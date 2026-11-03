
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  LoaderCircle,
  PlusCircle,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
};

type EditForm = {
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
};

const emptyForm: EditForm = {
  title: "",
  description: "",
  category: "",
  image: "",
  location: "",
  date: "",
};

const categories = [
  "Environment",
  "Education",
  "Community",
  "Health",
  "Animal Welfare",
  "Other",
];

function toLocalDateTime(date: string) {
  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 16);
}
function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
function getMinimumDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function ManageEvents() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMyEvents = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authenticatedFetch("/api/events/mine", {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load your events.");
      }

      const data: EventItem[] = result.events ?? [];
      setEvents(
        data.sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
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

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session) {
      fetchMyEvents();
    }
  }, [session, fetchMyEvents, retry]);

  const startEditing = (event: EventItem) => {
    setEditingId(event._id);
    setEditForm({
      title: event.title,
      description: event.description,
      category: event.category,
      image: event.image,
      location: event.location,
      date: toLocalDateTime(event.date),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleEditChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId) return;

    const title = editForm.title.trim();
    const description = editForm.description.trim();
    const category = editForm.category.trim();
    const image = editForm.image.trim();
    const location = editForm.location.trim();

    // Required field validation
    if (!title || !description || !category || !image || !location || !editForm.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Title validation
    if (title.length > 120) {
      toast.error("Event title cannot exceed 120 characters.");
      return;
    }

    // Description validation
    if (description.length > 2000) {
      toast.error("Description cannot exceed 2000 characters.");
      return;
    }

    // Image URL validation
    if (!isValidHttpUrl(image)) {
      toast.error("Please enter a valid image URL starting with http or https.");
      return;
    }

    // Date validation
    const eventDate = new Date(editForm.date);

    if (Number.isNaN(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
      toast.error("Please select a valid future date and time.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await authenticatedFetch(
        `/api/events/${editingId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title,
            description,
            category,
            image,
            location,
            date: eventDate.toISOString(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update this event.");
      }

      toast.success("Event updated successfully!");

      cancelEditing();
      await fetchMyEvents();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(eventId);

    try {
      const response = await authenticatedFetch(
        `/api/events/${eventId}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete this event.");
      }

      setEvents((previous) =>
        previous.filter((item) => item._id !== eventId)
      );

      if (editingId === eventId) {
        cancelEditing();
      }

      toast.success("Event deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/15";

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
      <section className="border-b border-border bg-[#176B45]/5">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#176B45]/10 px-3 py-1.5 text-sm font-semibold text-[#176B45]">
            <Pencil size={16} />
            Event Management
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Manage Your Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            View, update, and manage the community events you have created.
          </p>

          <Link
            href="/create-event"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125638]"
          >
            <PlusCircle size={18} />
            Create New Event
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-foreground">
            Your Created Events
          </h2>
          {!isLoading && !error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {events.length} event{events.length === 1 ? "" : "s"} created
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground">
            <LoaderCircle size={20} className="animate-spin" />
            Loading your events...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="font-semibold text-red-600">
              Could not load your events
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
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
          <div className="rounded-2xl border border-dashed border-border px-5 py-16 text-center">
            <CalendarDays
              size={38}
              className="mx-auto text-muted-foreground"
            />
            <h3 className="mt-4 text-lg font-bold text-foreground">
              You haven't created any events
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first community event and invite people to join.
            </p>
            <Link
              href="/create-event"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
            >
              <PlusCircle size={17} />
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="grid md:grid-cols-[240px_1fr]">
                  <div className="relative min-h-48 bg-muted md:min-h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(imageEvent) => {
                        imageEvent.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-[#176B45]/10 px-3 py-1 text-xs font-semibold text-[#176B45]">
                          {item.category}
                        </span>
                        <h3 className="mt-3 text-xl font-bold text-foreground">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:bg-muted"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                        >
                          {deletingId === item._id ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-[#176B45]" />
                        {new Date(item.date).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>

                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#176B45]" />
                        {item.location}
                      </span>
                    </div>

                    <Link
                      href={`/events/${item._id}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#176B45] hover:underline"
                    >
                      View Event Details
                    </Link>
                  </div>
                </div>

                {editingId === item._id && (
                  <div className="border-t border-border bg-muted/20 p-5 sm:p-7">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <h4 className="text-lg font-bold text-foreground">
                        Edit Event
                      </h4>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Close edit form"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdate} className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="edit-title" className="text-sm font-semibold">
                          Event Title
                        </label>
                        <input
                          id="edit-title"
                          name="title"
                          required
                          maxLength={120}
                          value={editForm.title}
                          onChange={handleEditChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="edit-category" className="text-sm font-semibold">
                          Category
                        </label>
                        <select
                          id="edit-category"
                          name="category"
                          required
                          value={editForm.category}
                          onChange={handleEditChange}
                          className={inputClass}
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label htmlFor="edit-description" className="text-sm font-semibold">
                          Description
                        </label>
                        <textarea
                          id="edit-description"
                          name="description"
                          required
                          maxLength={2000}
                          rows={4}
                          value={editForm.description}
                          onChange={handleEditChange}
                          className={`${inputClass} resize-y`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="edit-image" className="text-sm font-semibold">
                          Image URL
                        </label>
                        <input
                          id="edit-image"
                          name="image"
                          type="url"
                          required
                          value={editForm.image}
                          onChange={handleEditChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="edit-location" className="text-sm font-semibold">
                          Location
                        </label>
                        <input
                          id="edit-location"
                          name="location"
                          required
                          value={editForm.location}
                          onChange={handleEditChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label htmlFor="edit-date" className="text-sm font-semibold">
                          Event Date & Time
                        </label>
                        <input
                          id="edit-date"
                          name="date"
                          type="datetime-local"
                          required
                          min={getMinimumDateTime()}
                          value={editForm.date}
                          onChange={handleEditChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="flex flex-wrap gap-3 sm:col-span-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#125638] disabled:opacity-60"
                        >
                          {isSaving ? (
                            <LoaderCircle size={17} className="animate-spin" />
                          ) : (
                            <Save size={17} />
                          )}
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                        >
                          <X size={17} />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
