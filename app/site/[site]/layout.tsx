import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: { site: string };
}

export async function generateMetadata({
  params,
}: {
  params: { site: string };
}): Promise<Metadata> {
  const { site } = await params;

  const siteData = await prisma.site.findUnique({
    where: {
      subdomain: site,
    },
  });

  if (!siteData) {
    notFound();
  }

  return {
    title: siteData.name,
    description: siteData.description,
  };
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { site } = await params;

  const siteData = await prisma.site.findUnique({
    where: {
      subdomain: site,
    },
  });

  if (!siteData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="text-2xl font-bold">
                {siteData.name}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center ">
            <p>
              © {new Date().getFullYear()} {siteData.name}. All rights reserved.
            </p>
            <p className="mt-2">
              Powered by{" "}
              <a
                href={process.env.NEXTAUTH_URL}
                className="text-blue-600 hover:underline"
              >
                Next Blog
              </a>
            </p>
            <p className="mt-2">
              Developed by{" "}
              <a
                href="https://github.com/AbidAlWassie"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                Abid Al Wassie
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
