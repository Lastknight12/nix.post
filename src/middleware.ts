import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "~/server/auth"

// Or like this if you need to do something here.
/*
 * middleware.ts
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({req: request})

  if(!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: "/dashboard",
}