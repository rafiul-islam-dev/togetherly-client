
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, ImagePlus, MapPin, PlusCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api";

type EventFormData = {
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
};

const initialForm: EventFormData = {
  title: "",
  description: "",
  category: "",
  image: "",
  location: "",
  date: "",
};
function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
function getLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function CreateEventForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState<EventFormData>(initialForm);
  const [minimumDate, setMinimumDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMinimumDate(getLocalDateTime());
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();
    const category = form.category.trim();
    const image = form.image.trim();
    const location = form.location.trim();

    // Authentication validation
    if (!session) {
      toast.error("Please log in before creating an event.");
      router.push("/login");
      return;
    }

    // Required field validation
    if (!title || !description || !category || !image || !location || !form.date) {
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
    const eventDate = new Date(form.date);

    if (Number.isNaN(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
      toast.error("Please select a valid future date and time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch("/api/events", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          category,
          image,
          location,
          date: eventDate.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not create the event.");
      }

      toast.success("Your event has been created successfully!");

      setForm(initialForm);

      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking your account...
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/15";

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#176B45]/10 px-3 py-1.5 text-sm font-medium text-[#176B45]">
          <PlusCircle size={16} />
          Community Events
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Create an Event
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Bring people together. Share an activity and make a positive
          difference in your community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold">
            Event Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={120}
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Community Tree Plantation"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold">
            Event Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={2000}
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your event and what participants will do..."
            className={`${inputClass} resize-y`}
          />
          <p className="text-right text-xs text-muted-foreground">
            {form.description.length}/2000 characters
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-semibold">
            Event Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a category</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Community">Community</option>
            <option value="Health">Health</option>
            <option value="Animal Welfare">Animal Welfare</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="flex items-center gap-2 text-sm font-semibold">
            <ImagePlus size={16} />
            Event Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            required
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/event-image.jpg"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="flex items-center gap-2 text-sm font-semibold">
            <MapPin size={16} />
            Event Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Dhaka, Bangladesh"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays size={16} />
            Event Date & Time
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            required
            min={minimumDate}
            value={form.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="border-t border-border pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PlusCircle size={18} />
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Your event will be published for the Togetherly community.
          </p>
        </div>
      </form>
    </section>
  );
}
