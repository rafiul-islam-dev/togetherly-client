
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, LoaderCircle, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setImage(session.user.image ?? "");
    }
  }, [session?.user]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (image.trim()) {
      try {
        const imageUrl = new URL(image.trim());

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          toast.error("Please enter a valid image URL.");
          return;
        }
      } catch {
        toast.error("Please enter a valid image URL.");
        return;
      }
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (error) {
        throw new Error(error.message || "Unable to update your profile.");
      }

      toast.success("Your profile has been updated successfully.");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading your profile...
        </p>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/15";

  const displayName = session.user.name || "Togetherly Member";
  const previewImage = image.trim();

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-[#176B45]/5">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#176B45]/10 px-3 py-1.5 text-sm font-semibold text-[#176B45]">
            <UserRound size={16} />
            Account Settings
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your personal information and how you appear in the
            Togetherly community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col items-center border-b border-border bg-muted/30 px-6 py-8">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-[#176B45]/10 shadow-sm">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-3xl font-bold text-[#176B45]">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-foreground">
              {name.trim() || displayName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="text-sm font-semibold"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-email"
                className="text-sm font-semibold"
              >
                Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                value={session.user.email}
                readOnly
                className={`${inputClass} cursor-not-allowed bg-muted text-muted-foreground`}
              />
              <p className="text-xs text-muted-foreground">
                Your registered email address cannot be changed here.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-image"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <Camera size={16} />
                Profile Picture URL
              </label>
              <input
                id="profile-image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className={inputClass}
              />
              <p className="text-xs text-muted-foreground">
                Paste a publicly accessible image URL. Leave it empty to
                remove your profile picture.
              </p>
            </div>

            <div className="border-t border-border pt-5">
              <button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Saving Profile..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
