"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  HeartHandshake,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "At least one uppercase letter (A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "At least one lowercase letter (a-z)",
      valid: /[a-z]/.test(password),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanImage = image.trim();

    if (isRegister) {
      if (!cleanName) {
        toast.error("Please enter your full name.");
        return;
      }

      if (cleanName.length > 100) {
        toast.error("Name cannot exceed 100 characters.");
        return;
      }

      if (!cleanEmail) {
        toast.error("Please enter your email address.");
        return;
      }

      if (!isPasswordValid) {
        toast.error("Please meet all password requirements.");
        return;
      }

      if (cleanImage) {
        try {
          const imageUrl = new URL(cleanImage);

          if (!["http:", "https:"].includes(imageUrl.protocol)) {
            throw new Error("Invalid image URL");
          }
        } catch {
          toast.error("Please enter a valid profile picture URL.");
          return;
        }
      }
    }

    if (!cleanEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { error } = await authClient.signUp.email({
          name: cleanName,
          email: cleanEmail,
          password,
          image: cleanImage || undefined,
        });

        if (error) {
          toast.error(error.message || "Registration failed.");
          return;
        }

        toast.success("Account created successfully!");
      } else {
        const { error } = await authClient.signIn.email({
          email: cleanEmail,
          password,
        });

        if (error) {
          toast.error(error.message || "Login failed.");
          return;
        }

        toast.success("Welcome back!");
      }

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google authentication failed.");
        setLoading(false);
      }
    } catch {
      toast.error("Could not connect with Google.");
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-9">
          <div className="mb-7 text-center">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-xl font-bold"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176B45] text-white">
                <HeartHandshake size={23} />
              </span>
              Togetherly
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {isRegister
                ? "Join Togetherly and make a difference in your community."
                : "Sign in to continue making a difference."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background font-medium transition hover:bg-muted disabled:opacity-60"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7Z"
              />
              <path
                fill="#34A853"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 2-7 2-5.3 0-9.8-3.6-11.4-8.4H6v5.2C9.4 39.5 16.1 44 24 44Z"
              />
              <path
                fill="#FBBC05"
                d="M12.6 27.8a12 12 0 0 1 0-7.6V15H6a20 20 0 0 0 0 18l6.6-5.2Z"
              />
              <path
                fill="#EA4335"
                d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.8 29.5 4 24 4 16.1 4 9.4 8.5 6 15l6.6 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Profile Picture URL{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    id="image"
                    type="url"
                    placeholder="https://example.com/profile.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    autoComplete="url"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add a direct link to your profile picture.
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={128}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-[#176B45] focus:ring-2 focus:ring-[#176B45]/20"
              />

              {isRegister && (
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="mb-2 text-xs font-semibold text-foreground">
                    Password must contain:
                  </p>

                  <div className="space-y-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        {rule.valid ? (
                          <CheckCircle2
                            size={15}
                            className="text-[#176B45]"
                          />
                        ) : (
                          <Circle
                            size={15}
                            className="text-muted-foreground"
                          />
                        )}

                        <span
                          className={
                            rule.valid
                              ? "text-[#176B45]"
                              : "text-muted-foreground"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (isRegister && !isPasswordValid)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-4 font-semibold text-white transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-semibold text-[#176B45] hover:underline"
            >
              {isRegister ? "Sign in" : "Create account"}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Small Actions. Stronger Communities.
        </p>
      </div>
    </section>
  );
}