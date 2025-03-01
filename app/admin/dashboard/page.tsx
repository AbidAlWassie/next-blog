import { auth } from "@/app/(auth)/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateSiteButton from "./create-site-button";

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
          <h2 className="text-xl font-medium text-gray-900">
            You don't have any sites yet
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
                <div className="mt-6 flex space-x-3">
                  <Link href={`/app/site/${site.id}`} className="">
                    Manage
                  </Link>
                  <Link
                    href={`${process.env.PROTOCOL}${site.subdomain}.${process.env.BASE_DOMAIN}`}
                    className=""
                    target="_blank"
                  >
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
