import type { Comment, User } from "@prisma/client";
import { CommentItem } from "./CommentItem";

type CommentWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image">;
};

interface CommentListProps {
  comments: CommentWithUser[];
  postId: string;
}

export function CommentList({ comments, postId }: CommentListProps) {
  // Group comments by parentId
  const commentMap = new Map<string | null, CommentWithUser[]>();

  // Initialize with empty arrays
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
