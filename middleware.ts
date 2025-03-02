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

  // For debugging in production
  console.log({
    hostname,
    path,
    baseDomain: process.env.BASE_DOMAIN,
    env: process.env.NODE_ENV,
  });

  // Check if we're on the main domain
  const isMainDomain =
    hostname === "frostcore.tech" ||
    hostname === process.env.BASE_DOMAIN ||
    hostname === "localhost:3000" ||
    hostname === "www.frostcore.tech";

  // Handle main domain routes
  if (isMainDomain) {
    // Root path
    if (path === "/" || path === "") {
      return NextResponse.rewrite(new URL("/home", req.url));
    }

    // Dashboard path
    if (path === "/dashboard") {
      return NextResponse.rewrite(new URL("/admin/dashboard", req.url));
    }

    // All other paths on main domain
    return NextResponse.rewrite(new URL(path, req.url));
  }

  // Handle subdomains
  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname.replace(`.frostcore.tech`, "")
      : hostname.replace(`.localhost:3000`, "");

  // Rewrite for site subdomain
  if (currentHost !== "app" && currentHost !== hostname) {
    return NextResponse.rewrite(
      new URL(`/site/${currentHost}${path}`, req.url)
    );
  }

  // If none of the conditions are met, just return the request as is
  return NextResponse.next();
}
