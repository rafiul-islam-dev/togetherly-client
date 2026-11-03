
import {
  CalendarDays,
  HandHeart,
  Users,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Discover Local Events",
    description:
      "Find meaningful volunteering opportunities and community activities happening around you.",
  },
  {
    icon: HandHeart,
    title: "Make Real Impact",
    description:
      "Turn your time and kindness into positive changes for people who need support.",
  },
  {
    icon: Users,
    title: "Build Connections",
    description:
      "Meet like-minded people, make friends, and grow a stronger community together.",
  },
  {
    icon: MapPin,
    title: "Help Your Neighborhood",
    description:
      "Take part in local cleanups, donation drives, plantation programs, and more.",
  },
  {
    icon: ShieldCheck,
    title: "Organize With Ease",
    description:
      "Create and manage your community events from one simple platform.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Journey",
    description:
      "Keep track of the events you organize and the activities you join.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[var(--secondary)]/60 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
            Why Togetherly
          </span>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Everything Starts With
            <span className="block text-[#287B50]">One Small Step.</span>
          </h2>

          <p className="mt-5 leading-8 text-[var(--muted)]">
            We make it easier to discover opportunities, bring people
            together, and create meaningful community impact.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-800 transition group-hover:bg-[#176B45] group-hover:text-white dark:bg-green-950 dark:text-green-300">
                  <Icon size={27} />
                </div>

                <p className="mt-6 text-xs font-bold text-green-700 dark:text-green-400">
                  0{index + 1}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-[var(--muted)]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
