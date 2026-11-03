"use client";
import { ArrowRight, Mail } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#176B45] px-7 py-16 text-white md:px-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Mail size={27} />
          </div>

          <h2 className="mt-7 text-4xl font-extrabold md:text-5xl">
            Good Things Start
            <span className="block text-[#C8EF76]">With Connection.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-8 text-green-100">
            Stay inspired by community stories, volunteering
            opportunities, and ideas that bring people together.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mx-auto mt-9 flex max-w-lg flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8EF76] px-6 py-3 font-bold text-green-950 transition hover:bg-lime-300"
            >
              Subscribe <ArrowRight size={17} />
            </button>
          </form>

          <p className="mt-4 text-xs text-green-100">
            Newsletter preview only. Subscription is not active yet.
          </p>
        </div>
      </div>
    </section>
  );
}
