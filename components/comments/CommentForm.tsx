"use client";

import { createComment } from "@/app/site/[site]/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";
import { useState } from "react";

interface CommentWithUser {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
  createdAt: string;
  parentId?: string;
  postId: string;
  userId: string;
  updatedAt: string;
}

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: (newComment: CommentWithUser) => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment({
        postId,
        content,
        parentId,
      });
      setContent("");
      onSuccess?.({
        ...newComment,
        createdAt: newComment.createdAt.toISOString(),
        updatedAt: newComment.updatedAt.toISOString(),
        parentId: newComment.parentId ?? undefined,
        user: {
          ...newComment.user,
          name: newComment.user.name ?? "",
        },
      });
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
