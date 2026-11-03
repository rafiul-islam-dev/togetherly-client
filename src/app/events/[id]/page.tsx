
import { Suspense } from "react";
import EventDetails from "@/components/events/event-details";

function EventDetailsFallback() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading event details...
      </p>
    </main>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<EventDetailsFallback />}>
      <EventDetails />
    </Suspense>
  );
}
