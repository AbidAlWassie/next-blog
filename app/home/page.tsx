// app/home/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">Next Blog</span>
        </h1>
        <p className="mt-3 text-2xl">Get started by creating your own blog</p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6">
          <Link
            href="/dashboard"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Dashboard &rarr;</h3>
            <p className="mt-4 text-xl">Manage your blogs and posts</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
