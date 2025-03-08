import { prisma } from "@/lib/prisma";

export async function getPostsQuery(skip: number, take: number) {
  return prisma.post.findMany({
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
    skip,
    take,
  });
}
