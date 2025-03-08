import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import type { Post } from "@/types/post";
import HomeClientPage from "./client";

export default async function HomePage() {
  const session = await auth();

  // Fetch initial posts on the server for better SEO
  const initialPostsRaw = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      site: {
        select: {
          name: true,
          subdomain: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
      reactions: {
        select: {
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Convert Date objects to strings to avoid serialization issues
  const initialPosts = initialPostsRaw.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  })) as unknown as Post[];

  const totalPosts = await prisma.post.count({
    where: {
      published: true,
    },
  });

  // Pass data to client component
  return (
    <HomeClientPage
      user={session?.user || null}
      initialPosts={initialPosts}
      hasMore={initialPosts.length < totalPosts}
    />
  );
}
