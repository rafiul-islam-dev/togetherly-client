
const galleryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop",
    title: "Helping Hands",
    category: "Community Support",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    title: "A Greener Tomorrow",
    category: "Tree Plantation",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop",
    title: "Together We Care",
    category: "Volunteering",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
    title: "Sharing Kindness",
    category: "Food Donation",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-[var(--secondary)]/60 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
            Moments That Matter
          </span>

          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
            A Community of Kindness
          </h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            Every photograph tells a story of people coming together
            to make the world a little better.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((item) => (
            <div
              key={item.title}
              className="group relative h-[320px] overflow-hidden rounded-3xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-lime-300">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
