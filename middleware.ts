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

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)

  // Define which hostnames are considered "main app" hostnames
  // and which are considered site hostnames
  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname.replace(`.${process.env.BASE_DOMAIN}`, "")
      : hostname.replace(
          `.${process.env.BASE_DOMAIN}:${process.env.PORT || 3000}`,
          ""
        );

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its subdirectories directly
  if (path.startsWith(`/sites`)) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // Special case for localhost development
  if (hostname === "localhost:3000" || hostname === process.env.BASE_DOMAIN) {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // Rewrite for site subdomain
  if (currentHost !== "app") {
    return NextResponse.rewrite(
      new URL(`/sites/${currentHost}${path}`, req.url)
    );
  }

  // If none of the conditions are met, just return the request as is
  return NextResponse.next();
}
