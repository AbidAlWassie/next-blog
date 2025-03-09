// app\home\client.tsx
"use client";

import { Navbar } from "@/components/Navbar";
import { PostPreview } from "@/components/posts/PostPreview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInfinitePosts } from "@/hooks/useInfinitePosts";
import type { Post, ReactionType } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Angry,
  Frown,
  Heart,
  Laugh,
  Loader2,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

// Define types for props
interface HomeClientPageProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  initialPosts: Post[];
  hasMore: boolean;
}

// Helper function to get reaction icon
const getReactionIcon = (type: ReactionType) => {
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
    default:
      return <ThumbsUp className="h-4 w-4" />;
  }
};

export default function HomeClientPage({
  user,
  initialPosts,
  hasMore,
}: HomeClientPageProps) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfinitePosts({
      initialData: {
        pages: [
          {
            posts: initialPosts,
            hasMore: hasMore,
            totalPosts: initialPosts.length + (hasMore ? 1 : 0), // Just a placeholder
          },
        ],
        pageParams: [1],
      },
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.posts.length / 10 + 1 : undefined;
      },
      enabled: true,
    });

  // Use the inView value directly with React Query
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Welcome to Next Blog</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover the latest posts from our community
          </p>

          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-destructive-foreground">
                Create Your Own Blog
              </Button>
            </Link>
          </div>
        </div>

        {/* Fix the status check with a type assertion */}
        {(status as string) === "loading" ||
        (status as string) === "pending" ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : status === "error" ? (
          <div className="text-center text-red-500">
            Error loading posts. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.pages.map((page, pageIndex) =>
                page.posts.map((post, postIndex) => (
                  <Card
                    key={`${pageIndex}-${post.id || postIndex}`}
                    className="overflow-hidden flex flex-col gap-y-2"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_PROTOCOL}${post.site.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`}
                          className="hover:underline"
                        >
                          {post.site.name}
                        </Link>
                        <span className="mx-2">•</span>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center mb-2">
                        {post.site.user.image ? (
                          <Image
                            src={post.site.user.image || "/placeholder.svg"}
                            alt={post.site.user.name || "Author"}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                        )}
                        <span className="text-sm">{post.site.user.name}</span>
                      </div>
                      {/* <div className="line-clamp-3 text-muted-foreground"> */}
                      <PostPreview
                        content={post.content}
                        title={post.title}
                        tags={post.tags || []}
                      />
                      {/* </div> */}
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {/* Comments count */}
                        <div className="flex items-center text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span className="text-xs">
                            {post.comments.length}
                          </span>
                        </div>

                        {/* Reactions summary */}
                        <div className="flex items-center text-muted-foreground">
                          <div className="flex -space-x-1 mr-1">
                            {/* Show reaction types that exist, or a default if none */}
                            {post.reactions && post.reactions.length > 0 ? (
                              Array.from(
                                new Set(post.reactions.map((r) => r.type))
                              )
                                .slice(0, 3)
                                .map((type, i) => (
                                  <div
                                    key={i}
                                    className="bg-muted rounded-full p-1"
                                  >
                                    {getReactionIcon(type)}
                                  </div>
                                ))
                            ) : (
                              <div className="bg-muted rounded-full p-1">
                                <ThumbsUp className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs">
                            {post.reactions?.length || 0}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`${process.env.NEXT_PUBLIC_PROTOCOL}${post.site.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}/${post.slug}`}
                        className="text-primary hover:underline text-sm"
                      >
                        Read more →
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            <div ref={ref} className="flex justify-center mt-8 py-8">
              {isFetchingNextPage ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : hasNextPage ? (
                <p className="text-center text-muted-foreground">
                  Loading more posts...
                </p>
              ) : (
                <p className="text-center text-muted-foreground">
                  No more posts to load
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
