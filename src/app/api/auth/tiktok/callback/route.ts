import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface TikTokOAuthState {
  channel: "tiktok";
  workspaceId: string;
  timestamp: number;
}

/**
 * TikTok OAuth Callback Handler.
 * Exchanges authorization code for TikTok user access token,
 * fetches user info, and saves authorized credentials to Supabase channels table.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://omni-sales-ai.vercel.app";

  if (error || !code) {
    const errorRedirect = new URL("/dashboard/channels", appUrl);
    errorRedirect.searchParams.set("error", error || "access_denied");
    if (errorDescription) {
      errorRedirect.searchParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(errorRedirect.toString());
  }

  let state: TikTokOAuthState = {
    channel: "tiktok",
    workspaceId: DEFAULT_WORKSPACE_ID,
    timestamp: Date.now(),
  };

  if (stateRaw) {
    try {
      state = JSON.parse(
        Buffer.from(stateRaw, "base64url").toString("utf-8")
      );
    } catch {
      // Use fallback defaults
    }
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.TIKTOK_APP_ID;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

  if (!clientKey || !clientSecret) {
    const errorRedirect = new URL("/dashboard/channels", appUrl);
    errorRedirect.searchParams.set("error", "tiktok_not_configured");
    errorRedirect.searchParams.set(
      "error_description",
      "TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET are not configured. Add them in Vercel environment variables."
    );
    return NextResponse.redirect(errorRedirect.toString());
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.data?.access_token) {
      const errorRedirect = new URL("/dashboard/channels", appUrl);
      errorRedirect.searchParams.set("error", "tiktok_token_exchange_failed");
      errorRedirect.searchParams.set(
        "error_description",
        tokenData.error?.message || tokenData.message || "Could not exchange TikTok authorization code for access token."
      );
      return NextResponse.redirect(errorRedirect.toString());
    }

    const accessToken = tokenData.data.access_token;
    let handle = "@tiktok_user";
    let displayName = "TikTok User";

    // 2. Query basic user profile
    try {
      const userRes = await fetch(
        "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userData = await userRes.json();
      if (userData.data?.user?.display_name) {
        displayName = userData.data.user.display_name;
        handle = `@${displayName.toLowerCase().replace(/\s+/g, "_")}`;
      }
    } catch (uErr) {
      console.warn("[TikTok User Info] Non-fatal fetch error:", uErr);
    }

    // Save authorized channel to Supabase
    const supabase = createAdminClient();
    await supabase.from("channels").upsert(
      {
        workspace_id: state.workspaceId,
        type: "tiktok",
        name: "TikTok Shop & DMs",
        status: "connected",
        ai_auto_reply: true,
        handle,
        credentials: {
          oauth_connected: true,
          auth_provider: "tiktok_business",
          access_token: accessToken,
          display_name: displayName,
          handle,
          scopes: [
            "user.info.basic",
            "direct_message.action",
            "direct_message.read",
          ],
          connected_at: new Date().toISOString(),
        },
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    const successRedirect = new URL("/dashboard/channels", appUrl);
    successRedirect.searchParams.set("connected", "tiktok");
    successRedirect.searchParams.set("status", "success");
    return NextResponse.redirect(successRedirect.toString());
  } catch (err) {
    console.error("[TikTok OAuth Callback Error]:", err);
    const errorRedirect = new URL("/dashboard/channels", appUrl);
    errorRedirect.searchParams.set("error", "tiktok_oauth_failed");
    return NextResponse.redirect(errorRedirect.toString());
  }
}
