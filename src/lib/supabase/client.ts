import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Creates or retrieves a singleton Supabase browser client.
 * Safe to use in Client Components ("use client").
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  if (!client) {
    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return client;
}

/**
 * Returns a Supabase browser client, or null if configuration is absent.
 * Safe for components that degrade gracefully when offline or in mock mode.
 */
export function getSafeBrowserClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-supabase-url")) {
      return null;
    }
    return createClient();
  } catch {
    return null;
  }
}
