import type React from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { site: string }
}) {
  const site = await prisma.site.findUnique({
    where: {
      subdomain: params.site,
    },
  })

  if (!site) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="text-2xl font-bold">
                {site.name}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <p className="mt-2">
              Powered by{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Multi-Tenant Blog
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

