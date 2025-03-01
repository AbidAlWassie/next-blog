import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function PostPage({ params }: { params: { site: string; slug: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      id: params.slug,
      published: true,
      site: {
        subdomain: params.site,
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
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">
        ← Back to {post.site.name}
      </Link>

      <article className="prose lg:prose-xl mx-auto">
        <h1>{post.title}</h1>

        <div className="flex items-center space-x-4 my-6">
          {post.site.user.image && (
            <img
              src={post.site.user.image || "/placeholder.svg"}
              alt={post.site.user.name || "Author"}
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <div className="text-gray-900 font-medium">{post.site.user.name}</div>
            <div className="text-gray-500">
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
  )
}

