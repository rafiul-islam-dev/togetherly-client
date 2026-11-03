const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiOptions = RequestInit;

export async function authenticatedFetch(
  path: string,
  options: ApiOptions = {}
) {
  const tokenResponse = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    throw new Error("Unable to get authentication token. Please log in.");
  }

  const tokenData = await tokenResponse.json();

  if (!tokenData.token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${tokenData.token}`);

  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}