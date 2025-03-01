"use client";

import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOutPage() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold">
            Sign Out
          </CardTitle>
          <CardDescription className="pt-2 text-center">
            Are you sure you want to sign out?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full"
          >
            {isSigningOut ? (
              "Signing out..."
            ) : (
              <>
                <FaSignOutAlt className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign Out
              </>
            )}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Cancel</Link>
          </Button>
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
}
