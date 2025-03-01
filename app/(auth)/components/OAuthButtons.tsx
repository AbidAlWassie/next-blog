import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface OAuthButtonsProps {
  onProviderSignIn: (provider: string) => void;
  loadingProvider: string | null;
}

export function OAuthButtons({
  onProviderSignIn,
  loadingProvider,
}: OAuthButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Button
        variant="outline"
        onClick={() => onProviderSignIn("google")}
        disabled={!!loadingProvider}
        className="bg-white text-black hover:bg-gray-100"
      >
        {loadingProvider === "google" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => onProviderSignIn("github")}
        disabled={!!loadingProvider}
        className="bg-gray-900 text-white hover:bg-gray-800"
      >
        {loadingProvider === "github" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
      <Button
        variant="outline"
        onClick={() => onProviderSignIn("discord")}
        disabled={!!loadingProvider}
        className="bg-[#5865F2] text-white hover:bg-[#4752C4]"
      >
        {loadingProvider === "discord" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaDiscord className="mr-2 h-4 w-4" />
        )}
        Discord
      </Button>
    </div>
  );
}
