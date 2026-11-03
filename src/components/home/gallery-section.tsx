
const galleryEvents = [
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop",
    title: "Community Park Cleanup",
    category: "Environment",
    date: "October 18, 2026",
    location: "Dhaka, Bangladesh",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    title: "Tree Plantation Campaign",
    category: "Environment",
    date: "October 12, 2026",
    location: "Green Community Park",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop",
    title: "Community Education Workshop",
    category: "Education",
    date: "October 05, 2026",
    location: "Community Learning Center",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
    title: "Community Food Distribution",
    category: "Community",
    date: "September 28, 2026",
    location: "Community Support Center",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-[var(--secondary)]/60 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
            Moments That Matter
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-foreground md:text-5xl">
            Our Past Events
          </h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            Take a look back at the moments when our community
            came together, shared kindness, and made a difference.
          </p>
        </div>

        {/* Past Events Gallery */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryEvents.map((event) => (
            <article
              key={event.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-[var(--secondary)]">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Category */}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#176B45]">
                  {event.category}
                </span>

                {/* Completed Badge */}
                <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
                  Completed
                </span>
              </div>

              {/* Event Information */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-foreground transition group-hover:text-[#176B45]">
                  {event.title}
                </h3>

                <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4">
                  {/* Date */}
                  <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-[#176B45]"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    {event.date}
                  </p>

                  {/* Location */}
                  <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-[#176B45]"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span className="line-clamp-1">
                      {event.location}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-[var(--muted)]">
            Every small action creates a bigger impact. 💚
          </p>
        </div>
      </div>
    </section>
  );
}
