"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Comment, User } from "@prisma/client";
import { formatRelative } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./CommentForm";

type CommentWithUser = Omit<Comment, "parentId"> & {
  parentId: string | null;
  user: Pick<User, "id" | "name" | "image">;
};

interface CommentItemProps {
  comment: CommentWithUser;
  postId: string;
  replies: CommentWithUser[];
  commentMap: Map<string | null, CommentWithUser[]>;
  onCommentAdded: (newComment: CommentWithUser) => void;
}

export function CommentItem({
  comment,
  postId,
  replies,
  commentMap,
  onCommentAdded,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={comment.user.image || ""}
          alt={comment.user.name || "User"}
        />
        <AvatarFallback>{comment.user.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{comment.user.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatRelative(new Date(comment.createdAt), new Date())}
            </div>
          </div>
          <div className="whitespace-pre-wrap">{comment.content}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>

        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSuccess={(newComment) => {
                setShowReplyForm(false);
                onCommentAdded({
                  ...newComment,
                  parentId: newComment.parentId || null,
                  createdAt: new Date(newComment.createdAt),
                  updatedAt: new Date(newComment.updatedAt),
                  user: {
                    ...newComment.user,
                    image: newComment.user.image || null,
                  },
                });
              }}
            />
          </div>
        )}

        {replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-6 border-l">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                replies={commentMap.get(reply.id) || []}
                commentMap={commentMap}
                onCommentAdded={onCommentAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
