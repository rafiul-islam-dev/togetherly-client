import { Suspense } from "react";
import JoinedEvents from "@/components/events/joined-events";

function JoinedEventsFallback() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading joined events...
      </p>
    </main>
  );
}

export default function JoinedEventsPage() {
  return (
    <Suspense fallback={<JoinedEventsFallback />}>
      <JoinedEvents />
    </Suspense>
  );
}