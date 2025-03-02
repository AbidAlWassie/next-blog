// app/(auth)/error/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Client-side component that uses `useSearchParams`
function ErrorPageContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!isClient) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="flex min-h-screen items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-gray-600 ">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold ">
            Authentication Error
          </CardTitle>
          <CardDescription className="pt-2 text-center">
            {error === "AccessDenied"
              ? "Access denied. Please try again."
              : "An error occurred during authentication."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button asChild className="w-full">
            <Link href="/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap the client-side component in Suspense
export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPageContent />
    </Suspense>
  );
}
