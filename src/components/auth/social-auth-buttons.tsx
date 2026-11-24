"use client";

import * as React from "react";
import { usePostHog } from "posthog-js/react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface SocialAuthButtonsProps {
  mode: "signin" | "signup";
  redirectTo?: string;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export function SocialAuthButtons({
  mode,
  redirectTo = "/dashboard",
  disabled = false,
  onError,
}: SocialAuthButtonsProps) {
  const posthog = usePostHog();
  const [loadingProvider, setLoadingProvider] = React.useState<"google" | "apple" | null>(null);

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoadingProvider(provider);
    onError?.("");

    try {
      posthog?.capture("auth_oauth_initiated", {
        provider,
        mode,
      });

      const supabase = createClient();
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        redirectTo
      )}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
          queryParams:
            provider === "google"
              ? { access_type: "offline", prompt: "consent" }
              : undefined,
        },
      });

      if (error) {
        onError?.(error.message);
        setLoadingProvider(null);
      }
    } catch {
      onError?.(
        `Impossible de démarrer la connexion avec ${
          provider === "google" ? "Google" : "Apple"
        }.`
      );
      setLoadingProvider(null);
    }
  };

  const actionLabel = mode === "signup" ? "S'inscrire avec" : "Continuer avec";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <Button
        type="button"
        variant="outline"
        disabled={disabled || loadingProvider !== null}
        isLoading={loadingProvider === "google"}
        onClick={() => handleOAuth("google")}
        className="apple-press h-10 rounded-2xl border-slate-200/80 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium shadow-2xs"
      >
        {loadingProvider !== "google" && (
          <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
            />
          </svg>
        )}
        <span className="truncate">{actionLabel} Google</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={disabled || loadingProvider !== null}
        isLoading={loadingProvider === "apple"}
        onClick={() => handleOAuth("apple")}
        className="apple-press h-10 rounded-2xl border-slate-900 bg-slate-950 hover:bg-slate-900 text-white text-xs font-medium shadow-2xs"
      >
        {loadingProvider !== "apple" && (
          <svg
            className="mr-2 h-4 w-4 shrink-0 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
          </svg>
        )}
        <span className="truncate">{actionLabel} Apple</span>
      </Button>
    </div>
  );
}
