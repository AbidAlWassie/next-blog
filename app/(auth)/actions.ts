"use server";

import { signIn } from "@/app/(auth)/auth";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function signUp({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email already in use",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: username,
      },
    });

    // Create credentials account
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
        hashedPassword,
      },
    });

    // Create verification token
    const token = uuidv4();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    await sendVerificationEmail(email, token, baseUrl);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "An error occurred during sign up",
    };
  }
}

export async function verifyEmail(token: string) {
  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return {
        success: false,
        error: "Invalid or expired verification token",
      };
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    });

    // Send welcome email
    await sendWelcomeEmail(user.email as string, user.name || undefined);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      error: "An error occurred during verification",
    };
  }
}

export async function signInWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.message === "Email not verified") {
        return {
          success: false,
          error: "Please verify your email before signing in",
        };
      }

      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    return {
      success: false,
      error: "An error occurred during sign in",
    };
  }
}
