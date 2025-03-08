"use client";

import { CommentWithUser } from "@/hooks/useComments";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: CommentWithUser[];
  postId: string;
}

export function CommentList({
  comments: initialComments,
  postId,
}: CommentListProps) {
  const queryClient = useQueryClient();

  // Initialize the query cache with the server-provided comments
  useEffect(() => {
    queryClient.setQueryData(["comments", postId], initialComments);
  }, [queryClient, initialComments, postId]);

  // Get comments from the cache
  const comments =
    queryClient.getQueryData<CommentWithUser[]>(["comments", postId]) ||
    initialComments;

  // Group comments by parentId
  const commentMap = new Map<string | null, CommentWithUser[]>();
  commentMap.set(null, []); // Top-level comments have null parentId

  // Group comments by parentId
  comments.forEach((comment) => {
    const parentId = comment.parentId;
    if (!commentMap.has(parentId)) {
      commentMap.set(parentId, []);
    }
    commentMap.get(parentId)!.push(comment);
  });

  // Get top-level comments
  const topLevelComments = commentMap.get(null) || [];

  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topLevelComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          replies={commentMap.get(comment.id) || []}
          commentMap={commentMap}
        />
      ))}
    </div>
  );
}
