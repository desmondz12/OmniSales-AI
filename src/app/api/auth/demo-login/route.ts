import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (role !== "super_admin" && role !== "business_client") {
      return NextResponse.json(
        { error: "Invalid role specified for demo authentication" },
        { status: 400 }
      );
    }

    const targetUrl = role === "super_admin" ? "/admin" : "/dashboard";
    const demoEmail =
      role === "super_admin" ? "admin@omnisales.cm" : "jeanluc@fotsotrading.cm";

    const response = NextResponse.json({
      success: true,
      redirectUrl: targetUrl,
      role,
      user: {
        email: demoEmail,
        name: role === "super_admin" ? "SaaS Super Admin" : "Jean-Luc Fotso",
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set secure httpOnly demo authentication cookies
    response.cookies.set("omnisales_role", role, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set("omnisales_demo_user", demoEmail, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Demo login error:", err);
    return NextResponse.json({ error: "Failed to authenticate demo session" }, { status: 500 });
  }
}
