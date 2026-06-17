import { NextResponse } from "next/server";

const protectedRoutes = ["/admin/dashboard"];
const authRoutes = ["/login", "/signup"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token && role !=="ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthRoute && token && role =="ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/login", "/signup"],
};
