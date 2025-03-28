import { signal } from "@preact/signals-react";

/**
 * Signal to track the user's login status.
 *
 * @constant {Signal<boolean>}
 * @default false - Indicates the user is not logged in by default.
 */
export const signalIsUserLoggedIn = signal(false);
export const signalAccessLevel = signal(0);

