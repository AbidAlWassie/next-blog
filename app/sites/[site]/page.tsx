import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function SitePage({ params }: { params: { site: string } }) {
  const site = await prisma.site.findUnique({
    where: {
      subdomain: params.site,
    },
    include: {
      posts: {
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })

  if (!site) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">{site.name}</h1>
        {site.description && <p className="mt-4 text-xl text-gray-600">{site.description}</p>}
        <div className="mt-6 flex items-center justify-center">
          {site.user.image && (
            <img
              src={site.user.image || "/placeholder.svg"}
              alt={site.user.name || "Author"}
              className="h-10 w-10 rounded-full mr-3"
            />
          )}
          <span className="text-gray-600">By {site.user.name}</span>
        </div>
      </div>

      <div className="space-y-10">
        {site.posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-900">No posts yet</h2>
            <p className="mt-2 text-gray-500">Check back later for new content.</p>
          </div>
        ) : (
          site.posts.map((post) => (
            <article key={post.id} className="border-b pb-10">
              <Link href={`/${post.id}`} className="block">
                <h2 className="text-2xl font-bold hover:text-blue-600 transition-colors">{post.title}</h2>
                <time className="text-gray-500 mt-2 block">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <div className="mt-4 text-gray-600 line-clamp-3">
                  {post.content.substring(0, 200)}
                  {post.content.length > 200 && "..."}
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 hover:underline">Read more →</span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

