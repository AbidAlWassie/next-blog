"use server";

import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SiteSchema = z.object({
  name: z.string().min(1).max(50),
  subdomain: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Subdomain can only contain lowercase letters, numbers, and hyphens",
    }),
  description: z.string().optional(),
});

export async function createSite(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const description = formData.get("description") as string;

  try {
    const validatedFields = SiteSchema.parse({
      name,
      subdomain,
      description,
    });

    // Check if subdomain is already taken
    const existingSite = await prisma.site.findUnique({
      where: {
        subdomain: validatedFields.subdomain,
      },
    });

    if (existingSite) {
      return {
        success: false,
        message: "Subdomain is already taken",
      };
    }

    // Create the site
    await prisma.site.create({
      data: {
        name: validatedFields.name,
        subdomain: validatedFields.subdomain,
        description: validatedFields.description,
        userId: session.user.id as string,
      },
    });

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Site created successfully",
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
