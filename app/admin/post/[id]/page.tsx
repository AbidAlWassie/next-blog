import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditPostForm } from "./EditPostForm";
import { Suspense } from "react";
import Loading from "./loading";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      site: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <Suspense fallback={<Loading />}>
        <EditPostForm post={post} />
      </Suspense>
    </div>
  );
}
