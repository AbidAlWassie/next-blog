// components/Navbar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ToggleTheme";

type NavbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  siteName?: string;
  isSubdomain?: boolean;
};

export function Navbar({ user, siteName, isSubdomain = false }: NavbarProps) {
  const [currentHost, setCurrentHost] = useState<string>("");

  useEffect(() => {
    // Get the current hostname
    const hostname = window.location.hostname;
    setCurrentHost(hostname);
  }, []);

  // Determine the sign-in redirect URL
  const getSignInUrl = () => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const isLocalhost = currentHost.includes("localhost");
    const mainDomain = isLocalhost ? "localhost:3000" : process.env.BASE_DOMAIN;

    if (isSubdomain) {
      const protocol = isLocalhost ? "http://" : "https://";
      return `${protocol}${mainDomain}/signin?callbackUrl=${encodeURIComponent(
        currentUrl
      )}`;
    }

    return "/signin";
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {isSubdomain ? (
                <Link href="/" className="text-xl font-bold">
                  {siteName || "Blog"}
                </Link>
              ) : (
                <Link href="/" className="text-xl font-bold">
                  📃Next Blog
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User avatar"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {!isSubdomain && (
                      <>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard"
                            className="flex items-center w-full"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({ callbackUrl: isSubdomain ? "/" : "/signin" })
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href={getSignInUrl()}>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
