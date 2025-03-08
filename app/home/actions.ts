"use server";

import { prisma } from "@/lib/prisma";
import { getPostsQuery } from "./queries";

export async function getPosts(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  try {
    const posts = await getPostsQuery(skip, limit);

    const totalPosts = await prisma.post.count({
      where: {
        published: true,
      },
    });

    return {
      posts,
      hasMore: skip + posts.length < totalPosts,
      totalPosts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
