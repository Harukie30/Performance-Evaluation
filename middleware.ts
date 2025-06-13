import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  console.log("Middleware called for path:", request.nextUrl.pathname);

  // Allow access to login page and static files
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".") // Allow all static files
  ) {
    console.log("Allowing access to:", request.nextUrl.pathname);
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const token = request.cookies.get("token");
  console.log("Token cookie:", token ? "present" : "not present");

  if (!token) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the token and get user info
    const user = await verifyAuth(token.value);
    if (!user) {
      console.log("Invalid token, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check role-based access for specific routes
    if (request.nextUrl.pathname.startsWith("/hr-dashboard")) {
      if (user.role.toLowerCase() !== "hr") {
        console.log("Unauthorized role for HR dashboard:", user.role);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith("/evaluator-dashboard")) {
      if (user.role.toLowerCase() !== "evaluator") {
        console.log("Unauthorized role for evaluator dashboard:", user.role);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (user.role.toLowerCase() !== "evaluator" && user.role.toLowerCase() !== "hr" && user.role.toLowerCase() !== "admin") {
        console.log("Unauthorized role for dashboard:", user.role);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    console.log("Allowing access to protected route:", request.nextUrl.pathname);
    return NextResponse.next();
  } catch (error) {
    console.error("Auth verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 