import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicRoute =
    pathname.startsWith("/_next") || pathname.startsWith("/static");

  // Get the userId cookie
  const userId = request.cookies.get("userId")?.value;

  // If user is not logged in and trying to access protected routes (including home page)
  if (!userId && !isAuthPage && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and trying to access auth pages
  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
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
