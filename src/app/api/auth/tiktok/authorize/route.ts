import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Initiates live TikTok Login Kit for Business / TikTok OAuth 2.0 flow.
 * Fails loudly if TIKTOK_CLIENT_KEY is not configured.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || DEFAULT_WORKSPACE_ID;

  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.TIKTOK_APP_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://omni-sales-ai.vercel.app";
  const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

  if (!clientKey) {
    const errorUrl = new URL("/dashboard/channels", appUrl);
    errorUrl.searchParams.set("error", "tiktok_not_configured");
    errorUrl.searchParams.set(
      "error_description",
      "TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET are not configured in Vercel environment variables yet."
    );
    return NextResponse.redirect(errorUrl.toString());
  }

  const scopes = [
    "user.info.basic",
    "direct_message.action",
    "direct_message.read",
  ];

  const state = Buffer.from(
    JSON.stringify({
      channel: "tiktok",
      workspaceId,
      timestamp: Date.now(),
    })
  ).toString("base64url");

  const tiktokOAuthUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  tiktokOAuthUrl.searchParams.set("client_key", clientKey);
  tiktokOAuthUrl.searchParams.set("scope", scopes.join(","));
  tiktokOAuthUrl.searchParams.set("response_type", "code");
  tiktokOAuthUrl.searchParams.set("redirect_uri", redirectUri);
  tiktokOAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(tiktokOAuthUrl.toString());
}
