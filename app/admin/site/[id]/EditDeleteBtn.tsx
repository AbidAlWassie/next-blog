"use client"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { DeleteConfirmation } from "./DeleteConfirmation"

export function EditDeleteButtons({ postId }: { postId: string }) {
  return (
    <div className="flex space-x-2">
      <Link href={`/admin/post/${postId}`}>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </Link>
      <DeleteConfirmation id={postId} type="post" />
    </div>
  )
}

