import { auth } from "@/app/(auth)/auth";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";
import { ReactionBar } from "@/components/reactions/ReactionBar";
import { prisma } from "@/lib/prisma";
import { ReactionType } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

type Params = {
  site: string;
  slug: string;
};

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { site, slug } = await params;
  const session = await auth();

  const post = await prisma.post.findFirst({
    where: {
      slug,
      published: true,
      site: {
        subdomain: site,
      },
    },
    include: {
      site: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      reactions: {
        select: {
          type: true,
          userId: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const reactionCounts = Object.values(ReactionType).map((type) => ({
    type,
    count: post.reactions.filter((r) => r.type === type).length,
  }));

  const userReactions = session?.user?.id
    ? post.reactions
        .filter((r) => r.userId === session?.user?.id)
        .map((r) => r.type)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose lg:prose-xl mx-auto">
        <Suspense fallback={<Loading />}>
          <div className="flex items-center space-x-4 my-6">
            {post.site.user.image && (
              <Image
                width={40}
                height={40}
                src={post.site.user.image || "/placeholder.svg"}
                alt={post.site.user.name || "Author"}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{post.site.user.name}</div>
              <div>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 whitespace-pre-wrap">{post.content}</div>
        </Suspense>
      </article>

      <div className="mt-12">
        <ReactionBar
          postId={post.id}
          reactions={reactionCounts}
          userReactions={userReactions}
          showSignIn={!session?.user}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <CommentList comments={post.comments} postId={post.id} />
        {session?.user && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
            <CommentForm postId={post.id} />
          </div>
        )}
      </div>
    </div>
  );
}
