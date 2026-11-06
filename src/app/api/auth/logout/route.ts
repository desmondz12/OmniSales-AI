import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, redirectUrl: "/login" });

  // Clear demo session cookies
  response.cookies.set("omnisales_role", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
  });

  response.cookies.set("omnisales_demo_user", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
  });

  return response;
}
