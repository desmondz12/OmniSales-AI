import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface OAuthState {
  channel: "instagram" | "messenger";
  workspaceId: string;
  timestamp: number;
}

/**
 * Live Meta OAuth Callback Handler.
 * Exchanges authorization code for a long-lived Page/IG access token,
 * subscribes the Page to real-time Messenger/Instagram webhooks,
 * and saves the real credentials to Supabase. Fails loudly if OAuth fails.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://omni-sales-ai.vercel.app";
  const redirectWithError = (errCode: string, detail?: string) => {
    const url = new URL("/dashboard/channels", appUrl);
    url.searchParams.set("error", errCode);
    if (detail) url.searchParams.set("error_description", detail);
    return NextResponse.redirect(url.toString());
  };

  if (error || !code) {
    return redirectWithError(
      error || "access_denied",
      errorDescription || "Facebook login was cancelled or denied."
    );
  }

  let state: OAuthState = {
    channel: "messenger",
    workspaceId: DEFAULT_WORKSPACE_ID,
    timestamp: Date.now(),
  };

  if (stateRaw) {
    try {
      state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf-8"));
    } catch {
      // Keep defaults
    }
  }

  const appId = process.env.META_APP_ID || process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = `${appUrl}/api/auth/meta/callback`;

  if (!appId || !appSecret) {
    return redirectWithError(
      "meta_not_configured",
      "META_APP_ID or META_APP_SECRET is missing in environment variables."
    );
  }

  try {
    // 1. Exchange code for short-lived user token
    const tokenUrl = new URL(
      "https://graph.facebook.com/v21.0/oauth/access_token"
    );
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return redirectWithError(
        "meta_token_exchange_failed",
        tokenData.error?.message || "Could not exchange code for Meta access token."
      );
    }

    // 2. Exchange for long-lived user token (60-day validity)
    const exchangeUrl = new URL(
      "https://graph.facebook.com/v21.0/oauth/access_token"
    );
    exchangeUrl.searchParams.set("grant_type", "fb_exchange_token");
    exchangeUrl.searchParams.set("client_id", appId);
    exchangeUrl.searchParams.set("client_secret", appSecret);
    exchangeUrl.searchParams.set("fb_exchange_token", tokenData.access_token);

    const exchangeRes = await fetch(exchangeUrl.toString());
    const exchangeData = await exchangeRes.json();
    const longLivedUserToken =
      exchangeData.access_token || tokenData.access_token;

    // 3. Query managed Facebook Pages and linked Instagram Business accounts
    const pagesUrl = new URL("https://graph.facebook.com/v21.0/me/accounts");
    pagesUrl.searchParams.set("access_token", longLivedUserToken);
    pagesUrl.searchParams.set(
      "fields",
      "id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}"
    );

    const pagesRes = await fetch(pagesUrl.toString());
    const pagesData = await pagesRes.json();
    const pages: Array<{
      id: string;
      name?: string;
      access_token?: string;
      instagram_business_account?: {
        id: string;
        username?: string;
        name?: string;
      };
    }> = pagesRes.ok && Array.isArray(pagesData.data) ? pagesData.data : [];

    // 3b. For Instagram Business Login (where Meta prompts for Business Portfolio + Instagram account
    //     without selecting a Facebook Page), resolve the IG account via debug_token granular_scopes
    //     or /me/businesses when /me/accounts returns empty.
    let resolvedPage = pages[0] || null;
    let igAccount = resolvedPage?.instagram_business_account || null;

    if (state.channel === "instagram" && !igAccount?.id) {
      // Try finding a page that has instagram_business_account attached
      const pageWithIg = pages.find((p) => p.instagram_business_account?.id);
      if (pageWithIg) {
        resolvedPage = pageWithIg;
        igAccount = pageWithIg.instagram_business_account || null;
      }
    }

    if (state.channel === "instagram" && !igAccount?.id) {
      try {
        const debugUrl = new URL("https://graph.facebook.com/v21.0/debug_token");
        debugUrl.searchParams.set("input_token", longLivedUserToken);
        debugUrl.searchParams.set("access_token", `${appId}|${appSecret}`);
        const debugRes = await fetch(debugUrl.toString());
        const debugJson = await debugRes.json();

        const granularScopes: Array<{ scope?: string; target_ids?: string[] }> =
          debugJson?.data?.granular_scopes || [];
        const igTargetId = granularScopes
          .filter(
            (s) =>
              s.scope === "instagram_basic" ||
              s.scope === "instagram_manage_messages"
          )
          .flatMap((s) => s.target_ids || [])[0];

        if (igTargetId) {
          const igRes = await fetch(
            `https://graph.facebook.com/v21.0/${igTargetId}?fields=id,username,name&access_token=${encodeURIComponent(
              longLivedUserToken
            )}`
          );
          const igJson = await igRes.json();
          if (igRes.ok && igJson?.id) {
            igAccount = {
              id: igJson.id,
              username: igJson.username,
              name: igJson.name,
            };
          }
        }
      } catch (debugErr) {
        console.warn("[Meta OAuth] debug_token IG lookup warning:", debugErr);
      }
    }

    if (state.channel === "instagram" && !igAccount?.id) {
      try {
        const bizRes = await fetch(
          `https://graph.facebook.com/v21.0/me/businesses?fields=id,name,instagram_accounts{id,username}&access_token=${encodeURIComponent(
            longLivedUserToken
          )}`
        );
        const bizJson = await bizRes.json();
        const firstIg = bizJson?.data
          ?.flatMap((b: { instagram_accounts?: { data?: Array<{ id: string; username?: string }> } }) => b.instagram_accounts?.data || [])
          ?.[0];
        if (firstIg?.id) {
          igAccount = {
            id: firstIg.id,
            username: firstIg.username,
          };
        }
      } catch (bizErr) {
        console.warn("[Meta OAuth] me/businesses IG lookup warning:", bizErr);
      }
    }

    if (state.channel === "messenger" && !resolvedPage) {
      return redirectWithError(
        "no_facebook_page_found",
        "No Facebook Page was found or selected. Please grant access to at least one Facebook Page."
      );
    }

    if (state.channel === "instagram" && !igAccount?.id) {
      return redirectWithError(
        "no_instagram_business_account",
        "Could not find an authorized Instagram Business account. Make sure your Instagram account is a Business/Professional account linked to your Facebook Page or Business Portfolio."
      );
    }

    const pageId: string | null = resolvedPage?.id || null;
    const pageName: string = resolvedPage?.name || "Instagram Business";
    const pageAccessToken: string =
      resolvedPage?.access_token || longLivedUserToken;
    const igUsername: string | null = igAccount?.username
      ? `@${igAccount.username}`
      : null;

    // 4. Subscribe the Page to Meta webhooks for live DM delivery (when a Page is linked)
    if (pageId) {
      try {
        await fetch(
          `https://graph.facebook.com/v21.0/${pageId}/subscribed_apps`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${pageAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscribed_fields: [
                "messages",
                "messaging_postbacks",
                "message_deliveries",
                "message_reads",
              ],
            }),
          }
        );
      } catch (subscribeErr) {
        console.warn("[Meta OAuth] Webhook subscription warning:", subscribeErr);
      }
    }

    // 5. Persist real credentials into Supabase channels table (update existing or insert)
    const targetChannel = state.channel;
    const finalHandle =
      targetChannel === "instagram" ? igUsername || pageName : pageName;
    const supabase = createAdminClient();

    const payload = {
      workspace_id: state.workspaceId,
      type: targetChannel,
      name:
        targetChannel === "instagram"
          ? "Instagram"
          : "Facebook Messenger",
      status: "connected" as const,
      ai_auto_reply: true,
      handle: finalHandle,
      credentials: {
        oauth_connected: true,
        auth_provider: "meta_login",
        access_token: pageAccessToken,
        page_id: pageId,
        page_name: pageName,
        ig_business_id: igAccount?.id || null,
        ig_handle: igUsername,
        available_pages: pages.map((p) => ({
          id: p.id,
          name: p.name || "Page",
        })),
        connected_at: new Date().toISOString(),
      },
      last_synced_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("channels")
      .select("id")
      .eq("workspace_id", state.workspaceId)
      .eq("type", targetChannel)
      .maybeSingle();

    if (existing?.id) {
      await supabase.from("channels").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("channels").insert(payload);
    }

    const successRedirect = new URL("/dashboard/channels", appUrl);
    successRedirect.searchParams.set("connected", targetChannel);
    successRedirect.searchParams.set("handle", finalHandle);
    return NextResponse.redirect(successRedirect.toString());
  } catch (err) {
    console.error("[Meta OAuth Callback Error]:", err);
    return redirectWithError(
      "oauth_exchange_failed",
      err instanceof Error ? err.message : "Unexpected error during Meta OAuth."
    );
  }
}
