// app/(auth)/auth.config.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const prisma = new PrismaClient();

export default {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
    newUser: "/",
    verifyRequest: "/verify-request",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            accounts: {
              where: {
                provider: "credentials",
              },
            },
          },
        });

        if (!user || !user.accounts[0]?.hashedPassword) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.accounts[0].hashedPassword
        );

        if (!passwordMatch) {
          return null;
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
