import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { getCookieName } from "./lib/utils";

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  let cookieName = getCookieName();
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
    cookieName,
  });

  const isAuthenticated = token != null;

  if (!isAuthenticated && !/^\/courses(\/[^\/]+)?$/.test(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(`/login?redirect=${req.nextUrl.pathname}`, req.url));
  }

  if (token != null && !token.isActive) {
    return NextResponse.redirect(new URL("/in-active-user", req.url));
  }

  if (req.nextUrl.pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    req.nextUrl.pathname.match("/admin/*") &&
    isAuthenticated &&
    !(token.role === "AUTHOR" || token.role === "ADMIN")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
}

export const config = {
  matcher: [
    "/courses",
    "/courses/:path*",
    "/notifications",
    "/guides",
    "/quizzes",
    "/add-course",
    "/learn/course/:path*",
    "/enroll-courses/",
    "/course/about/:path*",
    "/dashboard",
    "/profile",
    "/admin/:path*",
    "/program/:path*/course/:path*",
    "/program/add-program",
    "/setting",
  ],
};
