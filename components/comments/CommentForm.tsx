"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "@/hooks/useComments";
import type React from "react";
import { useState } from "react";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const { addComment, isAddingComment } = useComments(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addComment(
      { content, parentId },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isAddingComment}
          className="text-colored"
        >
          {isAddingComment ? "Submitting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
