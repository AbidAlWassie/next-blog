import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SitePage({
  params,
}: {
  params: { site: string };
}) {
  const { site } = await params; // Await params here
  const siteData = await prisma.site.findUnique({
    where: {
      subdomain: site,
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
  });

  if (!siteData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">{siteData.name}</h1>
        {siteData.description && (
          <p className="mt-4 text-xl ">{siteData.description}</p>
        )}
        <div className="mt-6 flex items-center justify-center">
          {siteData.user?.image && (
            <img
              src={siteData.user.image || "/placeholder.svg"}
              alt={siteData.user.name || "Author"}
              className="w-10 h-10 rounded-full"
            />
          )}
          <p className="ml-4 ">By {siteData.user?.name}</p>
        </div>
      </div>

      <div className="space-y-8">
        {siteData.posts.length > 0 ? (
          siteData.posts.map((post) => (
            <article key={post.id} className="prose lg:prose-xl mx-auto">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="mt-2">{post.content}</p>
              <Link
                href={`/${post.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))
        ) : (
          <p className="text-center">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
