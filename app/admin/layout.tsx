import { auth } from "@/app/(auth)/auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { redirect } from "next/navigation";
import type React from "react";
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen ">
      <nav className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* Add your logo here */}
                <span className="text-xl font-bold">Your Logo</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="">
                Welcome, {session.user.name || session.user.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </main>
    </div>
  );
}
