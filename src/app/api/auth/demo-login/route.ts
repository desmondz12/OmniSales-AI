import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();

    if (role !== "super_admin" && role !== "business_client") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const targetUrl = role === "super_admin" ? "/admin" : "/dashboard";
    const response = NextResponse.json({ success: true, redirectUrl: targetUrl });

    // Set demo role cookie
    response.cookies.set("omnisales_role", role, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("omnisales_demo_user", role === "super_admin" ? "admin@omnisales.ai" : "musa@omnisales.ai", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Demo login error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
