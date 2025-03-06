"use server";

import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import { ReactionType } from "@prisma/client";
import { getSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1),
  parentId: z.string().optional(),
});

export async function createComment(data: z.infer<typeof CommentSchema>) {
  const session = await getSession();
  if (!session) {
    throw new Error("You must be logged in to comment.");
  }

  if (!session.user || !session.user.id) {
    throw new Error("User ID not found");
  }

  const validatedData = CommentSchema.parse(data);

  const comment = await prisma.comment.create({
    data: {
      content: validatedData.content,
      postId: validatedData.postId,
      parentId: validatedData.parentId || null,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return comment;
}

// Reaction management
const ReactionSchema = z.object({
  postId: z.string(),
  type: z.nativeEnum(ReactionType),
});

export async function addReaction(data: z.infer<typeof ReactionSchema>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const validatedData = ReactionSchema.parse(data);

  // Check if reaction already exists
  const existingReaction = await prisma.reaction.findFirst({
    where: {
      postId: validatedData.postId,
      userId: session.user.id,
      type: validatedData.type,
    },
  });

  if (existingReaction) {
    return existingReaction;
  }

  // Create the reaction
  if (!session.user.id) {
    throw new Error("User ID not found");
  }

  const reaction = await prisma.reaction.create({
    data: {
      type: validatedData.type,
      postId: validatedData.postId,
      userId: session.user.id,
    },
  });

  // Get the site and slug for revalidation
  const postWithSite = await prisma.post.findUnique({
    where: { id: validatedData.postId },
    include: { site: true },
  });

  if (postWithSite) {
    revalidatePath(`/site/${postWithSite.site.subdomain}/${postWithSite.slug}`);
  }

  return reaction;
}

export async function removeReaction(data: z.infer<typeof ReactionSchema>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const validatedData = ReactionSchema.parse(data);

  // Delete the reaction
  await prisma.reaction.deleteMany({
    where: {
      postId: validatedData.postId,
      userId: session.user.id,
      type: validatedData.type,
    },
  });

  // Get the site and slug for revalidation
  const postWithSite = await prisma.post.findUnique({
    where: { id: validatedData.postId },
    include: { site: true },
  });

  if (postWithSite) {
    revalidatePath(`/site/${postWithSite.site.subdomain}/${postWithSite.slug}`);
  }

  return { success: true };
}
