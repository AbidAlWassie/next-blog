"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deletePost } from "./actions";

export function EditDeleteButtons({ postId }: { postId: string }) {
  const handleDelete = async () => {
    const response = await deletePost(postId);
    if (response.success) {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/admin/post/${postId}`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
