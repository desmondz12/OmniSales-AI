import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Check Supabase session
  let user = null;
  try {
    const authResult = await supabase.auth.getUser();
    user = authResult.data?.user;
  } catch {
    // If Supabase connection fails, continue safely
  }

  // Check demo session cookie for instant testing
  const demoRole = request.cookies.get("omnisales_role")?.value;
  const isAuthenticated = Boolean(user || demoRole);

  const pathname = request.nextUrl.pathname;

  // Protect /admin portal
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    // Only super_admin can access /admin
    if (demoRole && demoRole !== "super_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Protect /dashboard routes: redirect unauthenticated users to /login
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  if (isAuthenticated && isAuthPage) {
    const rawRedirect = request.nextUrl.searchParams.get("redirectTo");
    const targetPath =
      rawRedirect &&
      rawRedirect.startsWith("/") &&
      !rawRedirect.startsWith("/login") &&
      !(rawRedirect.startsWith("/admin") && demoRole !== "super_admin")
        ? rawRedirect
        : demoRole === "super_admin"
        ? "/admin"
        : "/dashboard";

    const url = new URL(targetPath, request.url);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
