import { getPostsQuery } from "@/app/home/queries";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const posts = await getPostsQuery(skip, limit);

    const totalPosts = await prisma.post.count({
      where: {
        published: true,
      },
    });

    return NextResponse.json({
      posts,
      hasMore: skip + posts.length < totalPosts,
      totalPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
