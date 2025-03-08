"use client";

import type { Post } from "@/types/post";

export function PostDataDebug({ post }: { post: Post }) {
  return (
    <details className="bg-yellow-100 p-2 mb-2 rounded text-xs">
      <summary className="font-bold cursor-pointer">Debug Post Data</summary>
      <pre className="mt-2 overflow-auto max-h-40">
        {JSON.stringify(
          {
            id: post.id,
            title: post.title,
            commentsCount: post.comments?.length || 0,
            reactionsCount: post.reactions?.length || 0,
            reactionTypes: post.reactions?.map((r) => r.type) || [],
            uniqueReactionTypes: Array.from(
              new Set(post.reactions?.map((r) => r.type) || [])
            ),
          },
          null,
          2
        )}
      </pre>
    </details>
  );
}
