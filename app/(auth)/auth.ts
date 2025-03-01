// app/(auth)/auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
});
export { NextAuth };
