"use client";

import * as React from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  React.useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname;
      const search = searchParams?.toString();
      if (search) {
        url += `?${search}`;
      }
      ph.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

function PostHogAuthSync() {
  const ph = usePostHog();
  const identifiedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!ph) return;
    const supabase = createClient();

    // Identify existing session on mount
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (user && identifiedRef.current !== user.id) {
        identifiedRef.current = user.id;
        ph.identify(user.id, {
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          provider: user.app_metadata?.provider || "email",
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user;
      if (event === "SIGNED_IN" && user) {
        if (identifiedRef.current !== user.id) {
          identifiedRef.current = user.id;
          ph.identify(user.id, {
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            provider: user.app_metadata?.provider || "email",
          });
          ph.capture("user_authenticated", {
            provider: user.app_metadata?.provider || "email",
          });
        }
      } else if (event === "SIGNED_OUT") {
        identifiedRef.current = null;
        ph.capture("user_signed_out");
        ph.reset();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  React.useEffect(() => {
    if (!key) return;
    posthog.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false, // Handled manually for Next.js App Router
      capture_pageleave: true,
    });
  }, [key, host]);

  if (!key) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <React.Suspense fallback={null}>
        <PostHogPageView />
      </React.Suspense>
      <PostHogAuthSync />
      {children}
    </PHProvider>
  );
}
