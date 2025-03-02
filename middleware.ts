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

export default function middleware(req: NextRequest) {
  // Clone the nextUrl to create an absolute URL we can modify
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const path = req.nextUrl.pathname;

  // Extract currentHost by stripping the base domain from hostname
  const currentHost = hostname.replace(`.${process.env.BASE_DOMAIN}`, "");

  // Special case for main domain (both development and production)
  if (hostname === "frostcore.tech" || hostname === process.env.BASE_DOMAIN) {
    if (path === "/") {
      url.pathname = "/home";
      return NextResponse.rewrite(url);
    } else if (path === "/dashboard") {
      url.pathname = "/admin/dashboard";
      return NextResponse.rewrite(url);
    }
    // For any other path, rewrite using the same URL
    return NextResponse.rewrite(url);
  }

  // Rewrite for site subdomain if it's not "app" and not the main hostname
  if (currentHost !== "app" && currentHost !== hostname) {
    url.pathname = `/site/${currentHost}${path}`;
    return NextResponse.rewrite(url);
  }

  // If none of the conditions are met, proceed as normal
  return NextResponse.next();
}
