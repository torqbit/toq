import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getCookieName } from "./lib/utils";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  let cookieName = getCookieName();
  const response = NextResponse.next();

  const isAuthenticated = req.cookies.get(cookieName)?.value;

  if (isAuthenticated && req.nextUrl.pathname == "/") {
    return NextResponse.redirect(new URL(`/login/sso`, req.url));
  }
}

export const config = {
  matcher: ["/", "/signup", "/dashboard", "/profile", "/admin/:path*", "/settings"],
};
