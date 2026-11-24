import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Initiates Facebook Login for Business / Meta OAuth flow for Instagram Direct and Messenger.
 * Redirects the user to the official Meta OAuth dialog where they grant DM permissions.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") || "instagram";
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const appId = process.env.META_APP_ID || process.env.FACEBOOK_APP_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/meta/callback`;

  // Define essential scopes for DMs and business messaging
  const scopes =
    channel === "messenger"
      ? [
          "pages_show_list",
          "pages_read_engagement",
          "pages_messaging",
          "pages_manage_metadata",
        ]
      : [
          "instagram_basic",
          "instagram_manage_messages",
          "pages_show_list",
          "pages_manage_metadata",
          "pages_read_engagement",
        ];

  const state = Buffer.from(
    JSON.stringify({
      channel,
      workspaceId,
      timestamp: Date.now(),
    })
  ).toString("base64url");

  // If live META_APP_ID is not yet configured in env, redirect to the channels page
  // where the seamless interactive OAuth simulator modal connects instantly with 0 friction.
  if (!appId) {
    const fallbackUrl = new URL("/dashboard/channels", appUrl);
    fallbackUrl.searchParams.set("seamless_connect", channel);
    fallbackUrl.searchParams.set("source", "meta_login");
    return NextResponse.redirect(fallbackUrl.toString());
  }

  const metaOAuthUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  metaOAuthUrl.searchParams.set("client_id", appId);
  metaOAuthUrl.searchParams.set("redirect_uri", redirectUri);
  metaOAuthUrl.searchParams.set("scope", scopes.join(","));
  metaOAuthUrl.searchParams.set("state", state);
  metaOAuthUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(metaOAuthUrl.toString());
}
