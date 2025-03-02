import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    site: string;
    slug: string;
  }>;
}

export default async function PostPage({ params }: PageProps) {
  const { site, slug } = await params;

  const post = await prisma.post.findFirst({
    where: {
      slug: slug,
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
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-8 inline-block"
      >
        ← Back to {post.site.name}
      </Link>

      <article className="prose lg:prose-xl mx-auto">
        <h1>{post.title}</h1>

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
      </article>
    </div>
  );
}
