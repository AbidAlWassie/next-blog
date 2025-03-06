"use client";

import { addReaction, removeReaction } from "@/app/site/[site]/[slug]/actions";
import { Button } from "@/components/ui/button";
import type { ReactionType } from "@prisma/client";
import {
  AlertCircle,
  Angry,
  Frown,
  Heart,
  Laugh,
  Loader2,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReactionButtonProps {
  postId: string;
  type: ReactionType;
  count: number;
  hasReacted: boolean;
  requiresAuth?: boolean;
}

export function ReactionButton({
  postId,
  type,
  count,
  hasReacted,
  requiresAuth,
}: ReactionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (requiresAuth) {
      // If auth is required but user isn't logged in, don't do anything
      // The sign-in component will be shown separately
      return;
    }

    setIsLoading(true);
    try {
      if (hasReacted) {
        await removeReaction({ postId, type });
      } else {
        await addReaction({ postId, type });
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "LIKE":
        return <ThumbsUp className="h-4 w-4" />;
      case "LOVE":
        return <Heart className="h-4 w-4" />;
      case "HAHA":
        return <Laugh className="h-4 w-4" />;
      case "WOW":
        return <AlertCircle className="h-4 w-4" />;
      case "SAD":
        return <Frown className="h-4 w-4" />;
      case "ANGRY":
        return <Angry className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant={hasReacted ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-1"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : getIcon()}
      <span>{count}</span>
    </Button>
  );
}
