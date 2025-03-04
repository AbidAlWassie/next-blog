import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import { ExternalLink, Wrench } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateSiteButton from "./createSiteBtn";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const sites = await prisma.site.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Sites</h1>
        <CreateSiteButton />
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-12 rounded-lg">
          <h2 className="text-xl font-medium ">
            You don&apos;t have any sites yet
          </h2>
          <p className="mt-2 ">Get started by creating a new site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold">{site.name}</h2>
                <p className=" mt-2">{site.description || "No description"}</p>
                <div className="mt-4 text-sm ">
                  <p>
                    Subdomain:{" "}
                    <span className="font-medium">
                      {site.subdomain}.{process.env.BASE_DOMAIN}
                    </span>
                  </p>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Link
                    href={`/admin/site/${site.id}`}
                    className="flex justify-center items-center bg-primary text-destructive-foreground p-2 rounded-md"
                  >
                    <Wrench size={16} strokeWidth={3} className="mx-1" />
                    Manage
                  </Link>
                  <Link
                    href={`${process.env.PROTOCOL}${site.subdomain}.${process.env.BASE_DOMAIN}`}
                    className="flex justify-center items-center bg-accent text-accent-foreground p-2 rounded-md"
                    target="_blank"
                  >
                    <ExternalLink size={16} strokeWidth={3} className="mx-1" />
                    View Site
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
