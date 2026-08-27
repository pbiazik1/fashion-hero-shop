"use client";

import { PostHogProvider as PostHogReactProvider } from "posthog-js/react";
import { isPostHogConfigured, posthog } from "@/lib/posthog-client";

/*
 * Udostepnia klienta PostHoga (chmura EU) hookom z posthog-js/react.
 * Sam init zyje w @/lib/posthog-client — patrz komentarz tam.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!isPostHogConfigured) return <>{children}</>;

  return <PostHogReactProvider client={posthog}>{children}</PostHogReactProvider>;
}
