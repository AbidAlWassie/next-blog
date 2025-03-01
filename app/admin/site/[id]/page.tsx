import { auth } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CreatePostButton from "./create-post-button";

export default async function SitePage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const site = await prisma.site.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!site) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{site.name}</h1>
          <p className="text-gray-500 mt-1">
            <a
              href={`${process.env.PROTOCOL}${site.subdomain}.${process.env.BASE_DOMAIN}:${process.env.PORT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {site.subdomain}.{process.env.BASE_DOMAIN}:{process.env.PORT}
            </a>
          </p>
        </div>
        <div className="flex space-x-4">
          <Link href="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <CreatePostButton siteId={site.id} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>

        {site.posts.length === 0 ? (
          <div className="text-center py-12  rounded-lg">
            <h3 className="text-lg font-medium ">No posts yet</h3>
            <p className="mt-2 ">Get started by creating your first post.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {site.posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{post.title}</h3>
                    <p className=" mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <Link href={`/admin/post/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
