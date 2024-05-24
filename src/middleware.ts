import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const user = await getToken({ req });
  if (user?.role !== "Admin") {
    return NextResponse.rewrite(new URL("/404", req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/",
};
