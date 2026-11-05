
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
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
import { EventCardSkeleton } from "@/components/shared/loading-skeleton";

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

  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Input styles: explicit colors for light and dark themes
  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/15 dark:border-gray-600 dark:bg-[#23372d] dark:text-white dark:placeholder:text-gray-400";

  const labelClass =
    "text-sm font-semibold text-gray-800 dark:text-gray-100";

  // Fetch user's events
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

  // Authentication check
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

  // Open Edit Modal
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

  // Close Edit Modal
  const cancelEditing = () => {
    if (isSaving) return;

    setEditingId(null);
    setEditForm(emptyForm);
  };

  // Open Delete Modal
  const openDeleteModal = (event: EventItem) => {
    setDeleteTarget(event);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    if (deletingId) return;

    setDeleteTarget(null);
  };

  // Escape key and background scroll handling
  useEffect(() => {
    if (!editingId && !deleteTarget) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isSaving || deletingId) return;

      setEditingId(null);
      setEditForm(emptyForm);
      setDeleteTarget(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [editingId, deleteTarget, isSaving, deletingId]);

  // Handle input changes
  const handleEditChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Update Event
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId) return;

    const title = editForm.title.trim();
    const description = editForm.description.trim();
    const category = editForm.category.trim();
    const image = editForm.image.trim();
    const location = editForm.location.trim();

    if (
      !title ||
      !description ||
      !category ||
      !image ||
      !location ||
      !editForm.date
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (title.length > 120) {
      toast.error("Event title cannot exceed 120 characters.");
      return;
    }

    if (description.length > 2000) {
      toast.error("Description cannot exceed 2000 characters.");
      return;
    }

    if (!isValidHttpUrl(image)) {
      toast.error(
        "Please enter a valid image URL starting with http or https."
      );
      return;
    }

    const eventDate = new Date(editForm.date);

    if (
      Number.isNaN(eventDate.getTime()) ||
      eventDate.getTime() <= Date.now()
    ) {
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

      setEditingId(null);
      setEditForm(emptyForm);

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

  // Confirm and Delete Event
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const eventId = deleteTarget._id;
    setDeletingId(eventId);

    try {
      const response = await authenticatedFetch(
        `/api/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete this event.");
      }

      setEvents((previous) =>
        previous.filter((item) => item._id !== eventId)
      );

      setDeleteTarget(null);
      toast.success("Event deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setDeletingId(null);
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

      {/* Events List */}
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
          <EventCardSkeleton count={6} />
        ) : error ? (
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
                          onClick={() => openDeleteModal(item)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={15} />
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
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================================= */}
      {/* EDIT EVENT MODAL */}
      {/* ================================= */}

      {editingId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSaving
            ) {
              cancelEditing();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-event-title"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#17251e]"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <div>
                <h2
                  id="edit-event-title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  Update Event
                </h2>

                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Modify the details for your social service initiative
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSaving}
                aria-label="Close edit modal"
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleUpdate}>
              <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
                <div className="space-y-2">
                  <label htmlFor="edit-title" className={labelClass}>
                    Title
                  </label>

                  <input
                    id="edit-title"
                    name="title"
                    required
                    maxLength={120}
                    value={editForm.title}
                    onChange={handleEditChange}
                    placeholder="Enter event title"
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="edit-category" className={labelClass}>
                      Event Type
                    </label>

                    <select
                      id="edit-category"
                      name="category"
                      required
                      value={editForm.category}
                      onChange={handleEditChange}
                      className={inputClass}
                    >
                      {!categories.includes(editForm.category) && (
                        <option value={editForm.category}>
                          {editForm.category}
                        </option>
                      )}

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-date" className={labelClass}>
                      Event Date
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
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-location" className={labelClass}>
                    Location
                  </label>

                  <input
                    id="edit-location"
                    name="location"
                    required
                    value={editForm.location}
                    onChange={handleEditChange}
                    placeholder="Enter event location"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-image" className={labelClass}>
                    Thumbnail Image URL
                  </label>

                  <input
                    id="edit-image"
                    name="image"
                    type="url"
                    required
                    value={editForm.image}
                    onChange={handleEditChange}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-description" className={labelClass}>
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
                    placeholder="Describe your event..."
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-[#1d3027]">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:bg-[#23372d] dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}

                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================= */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingId
            ) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            aria-describedby="delete-event-description"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-[#17251e]"
          >
            <div className="flex items-start gap-4">
              {/* Delete Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                <Trash2 size={23} />
              </div>

              {/* Confirmation Message */}
              <div className="min-w-0 flex-1">
                <h2
                  id="delete-event-title"
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  Delete Event?
                </h2>

                <p
                  id="delete-event-description"
                  className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
                >
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {deleteTarget.title}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingId)}
                aria-label="Close delete confirmation"
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* Delete Modal Footer */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-[#23372d] dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}

                {deletingId ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
