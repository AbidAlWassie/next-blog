import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /signin, /signout, /error, /verify-request routes
     * 6. /app routes
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+|signin|signout|error|verify-request|admin).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const path = url.pathname;

  // Define which hostnames are considered "main app" hostnames
  // and which are considered site hostnames
  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname.replace(`.${process.env.BASE_DOMAIN}`, "")
      : hostname.replace(`.localhost:3000`, "");

  // Special case for development and production
  if (
    hostname === "frostcore.tech" ||
    hostname === process.env.BASE_DOMAIN ||
    hostname === "localhost:3000"
  ) {
    // Rewrite root path to /home
    if (path === "/") {
      return NextResponse.rewrite(new URL(`/home`, req.url));
    } else if (path === "/dashboard") {
      // Rewrite /dashboard to /admin/dashboard while keeping the original URL
      return NextResponse.rewrite(new URL(`/admin/dashboard`, req.url));
    }
    return NextResponse.rewrite(new URL(`${path}`, req.url));
  }

  // Rewrite for site subdomain
  if (currentHost !== "app" && currentHost !== hostname) {
    return NextResponse.rewrite(
      new URL(`/site/${currentHost}${path}`, req.url)
    );
  }

  // If none of the conditions are met, just return the request as is
  return NextResponse.next();
}
