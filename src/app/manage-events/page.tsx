import { Suspense } from "react";
import ManageEvents from "@/components/events/manage-events";


function ManageEventsFallback() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading manage events...
      </p>
    </main>
  );
}

export default function ManageEventsPage() {
  return (
    <Suspense fallback={<ManageEventsFallback />}>
      <ManageEvents />
    </Suspense>
  );
}