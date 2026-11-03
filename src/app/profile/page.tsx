import { Suspense } from "react";
import ProfileForm from "@/components/profile/profile-form";

function ProfileFallback() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading profile...
      </p>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileForm />
    </Suspense>
  );
}