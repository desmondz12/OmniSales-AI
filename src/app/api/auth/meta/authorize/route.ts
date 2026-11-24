import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Initiates Facebook Login for Business / Meta OAuth flow for Instagram Direct and Messenger.
 *
 * Uses config_id when META_CONFIG_ID_MESSENGER / META_CONFIG_ID_INSTAGRAM env vars exist
 * (Facebook Login for Business — permissions are set in the Meta App Dashboard configuration).
 * Falls back to raw scope parameters for classic Facebook Login apps.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") || "instagram";
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const appId = process.env.META_APP_ID || process.env.FACEBOOK_APP_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://omni-sales-ai.vercel.app";
  const redirectUri = `${appUrl}/api/auth/meta/callback`;

  if (!appId) {
    const errorUrl = new URL("/dashboard/channels", appUrl);
    errorUrl.searchParams.set("error", "meta_not_configured");
    errorUrl.searchParams.set(
      "error_description",
      "META_APP_ID is not configured in Vercel environment variables."
    );
    return NextResponse.redirect(errorUrl.toString());
  }

  const state = Buffer.from(
    JSON.stringify({
      channel,
      workspaceId,
      timestamp: Date.now(),
    })
  ).toString("base64url");

  // ── Facebook Login for Business uses config_id (permissions managed in Meta App Dashboard) ──
  const configId =
    channel === "messenger"
      ? process.env.META_CONFIG_ID_MESSENGER
      : process.env.META_CONFIG_ID_INSTAGRAM;

  const metaOAuthUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  metaOAuthUrl.searchParams.set("client_id", appId);
  metaOAuthUrl.searchParams.set("redirect_uri", redirectUri);
  metaOAuthUrl.searchParams.set("state", state);
  metaOAuthUrl.searchParams.set("response_type", "code");

  if (configId) {
    // Facebook Login for Business — permissions bundled in config_id, no scope param needed
    metaOAuthUrl.searchParams.set("config_id", configId);
    metaOAuthUrl.searchParams.set("override_default_response_type", "true");
  } else {
    // Classic Facebook Login fallback — pass scopes directly
    // Using only the minimal scopes that are valid for the app type
    const scopes =
      channel === "messenger"
        ? [
            "pages_messaging",
            "pages_manage_metadata",
            "pages_read_engagement",
            "pages_show_list",
          ]
        : [
            "instagram_basic",
            "instagram_manage_messages",
            "pages_manage_metadata",
            "pages_read_engagement",
            "pages_show_list",
          ];
    metaOAuthUrl.searchParams.set("scope", scopes.join(","));
  }

  return NextResponse.redirect(metaOAuthUrl.toString());
}
