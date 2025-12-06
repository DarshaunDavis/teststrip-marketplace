// src/lislalId.ts
// Helper to start the Lislal ID login flow.

const LISLAL_ID_BASE_URL =
  import.meta.env.VITE_LISLAL_ID_BASE_URL ?? "https://lislal.com";

const LISLAL_ID_CLIENT_ID =
  import.meta.env.VITE_LISLAL_ID_CLIENT_ID ?? "teststrip-marketplace-dev";

/**
 * Start the Lislal ID login/registration flow.
 *
 * Lislal.com is expected to:
 *  - authenticate / register the user
 *  - create or update their Lislal user record
 *  - issue a Firebase custom token for THIS app
 *  - redirect back to: {origin}/lislal-callback?firebaseCustomToken=...
 */
export function startLislalLogin() {
  const callback = `${window.location.origin}/lislal-callback`;

  const url = new URL("/id", LISLAL_ID_BASE_URL);
  url.searchParams.set("app", LISLAL_ID_CLIENT_ID);
  url.searchParams.set("redirect_uri", callback);

  window.location.href = url.toString();
}
