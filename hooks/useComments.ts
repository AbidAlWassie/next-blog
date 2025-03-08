"use client";

import { createComment } from "@/app/site/[site]/[slug]/actions";
import type { Comment, User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CommentWithUser = Omit<
  Comment,
  "parentId" | "createdAt" | "updatedAt"
> & {
  parentId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: Pick<User, "id" | "name" | "image">;
};

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  // use mutation to a comment
  const addCommentMutation = useMutation({
    mutationFn: async ({
      content,
      parentId,
    }: {
      content: string;
      parentId?: string;
    }) => {
      const newComment = await createComment({
        postId,
        content,
        parentId,
      });

      return {
        ...newComment,
        createdAt:
          newComment.createdAt instanceof Date
            ? newComment.createdAt
            : new Date(newComment.createdAt),
        updatedAt:
          newComment.updatedAt instanceof Date
            ? newComment.updatedAt
            : new Date(newComment.updatedAt),
        parentId: newComment.parentId ?? null,
        user: {
          ...newComment.user,
          name: newComment.user.name ?? "",
          image: newComment.user.image ?? null,
        },
      } as CommentWithUser;
    },
    onSuccess: (newComment) => {
      // update the comments list
      queryClient.setQueryData<CommentWithUser[]>(
        ["comments", postId],
        (oldComments = []) => {
          return [newComment, ...oldComments];
        }
      );
    },
  });

  return {
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
  };
}
