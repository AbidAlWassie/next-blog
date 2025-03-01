"use client";

import { verifyEmail } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setIsVerifying(false);
        setError("Verification token is missing");
        return;
      }

      try {
        const result = await verifyEmail(token);
        setIsVerifying(false);

        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.error || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setIsVerifying(false);
        setError("An unexpected error occurred");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isVerifying
              ? "Verifying your email"
              : isSuccess
                ? "Email verified!"
                : "Verification failed"}
          </CardTitle>
          <CardDescription>
            {isVerifying
              ? "Please wait while we verify your email address"
              : isSuccess
                ? "Your email has been successfully verified"
                : "We couldn't verify your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : isSuccess ? (
            <>
              <p>
                Your account is now active. You can now sign in to your account.
              </p>
              <Button className="w-full" onClick={() => router.push("/signin")}>
                Sign In
              </Button>
            </>
          ) : (
            <>
              <p className="text-red-500">{error}</p>
              <Button className="w-full" onClick={() => router.push("/signin")}>
                Back to Sign In
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
