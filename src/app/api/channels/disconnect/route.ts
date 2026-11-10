import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ChannelType } from "@/types/database";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { channel } = (await req.json()) as { channel: ChannelType };

    if (!channel) {
      return NextResponse.json(
        { error: "Channel type is required" },
        { status: 400 }
      );
    }

    try {
      const supabase = createAdminClient();
      await supabase
        .from("channels")
        .update({
          status: "disconnected",
          credentials: {},
          last_synced_at: new Date().toISOString(),
        })
        .eq("type", channel);
    } catch (dbError) {
      console.warn("[Channels Disconnect] Database write skipped:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: `${channel} disconnected successfully.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
