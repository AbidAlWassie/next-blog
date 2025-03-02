import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">404 - Site Not Found</h1>
        <p className="mt-3 text-2xl">The site you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="mt-8 text-blue-600 hover:underline">
          Return to Home
        </Link>
      </main>
    </div>
  )
}

