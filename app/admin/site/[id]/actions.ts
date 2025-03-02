"use server";

import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  siteId: z.string(),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const siteId = formData.get("siteId") as string;

  try {
    const validatedFields = PostSchema.parse({
      title,
      content,
      siteId,
    });

    // Verify that the site belongs to the user
    const site = await prisma.site.findUnique({
      where: {
        id: validatedFields.siteId,
        userId: session.user.id,
      },
    });

    if (!site) {
      return {
        success: false,
        message: "Site not found or you do not have permission",
      };
    }

    // Generate slug from title
    const slug = generateSlug(validatedFields.title);

    // Create the post
    await prisma.post.create({
      data: {
        title: validatedFields.title,
        slug,
        content: validatedFields.content,
        siteId: validatedFields.siteId,
        published: true, // You can change this to false if you want drafts
      },
    });

    revalidatePath(`/admin/site/${validatedFields.siteId}`);

    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function editPost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  const postId = formData.get("postId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    const validatedFields = PostSchema.omit({ siteId: true }).parse({
      title,
      content,
    });

    // Verify that the post belongs to the user
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        site: true,
      },
    });

    if (!post || post.site.userId !== session.user.id) {
      return {
        success: false,
        message: "Post not found or you do not have permission",
      };
    }

    // Generate slug from title
    const slug = generateSlug(validatedFields.title);

    // Update the post
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: validatedFields.title,
        slug,
        content: validatedFields.content,
      },
    });

    revalidatePath(`/admin/site/${post.siteId}`);

    return {
      success: true,
      message: "Post updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function deletePost(postId: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  try {
    // Verify that the post belongs to the user
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        site: true,
      },
    });

    if (!post || post.site.userId !== session.user.id) {
      return {
        success: false,
        message: "Post not found or you do not have permission",
      };
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath(`/admin/site/${post.siteId}`);

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
