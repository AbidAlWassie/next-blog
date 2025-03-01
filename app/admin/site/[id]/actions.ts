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

    // Create the post
    await prisma.post.create({
      data: {
        title: validatedFields.title,
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
