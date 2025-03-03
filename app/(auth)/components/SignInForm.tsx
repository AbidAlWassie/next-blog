"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function SignInForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
}: SignInFormProps) {
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="signinBtn w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In with Email"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="oauthBtn"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="oauthBtn"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
}
