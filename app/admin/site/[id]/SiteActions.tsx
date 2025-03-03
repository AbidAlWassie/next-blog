"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deletePost } from "./actions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPost } from "./actions";

export function EditDeleteButtons({ postId }: { postId: string }) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("postId", postId);
    const response = await deletePost(formData);
    if (response.success) {
      // Refresh the page or handle the UI update
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

export default function CreatePostButton({ siteId }: { siteId: string }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("siteId", siteId);

    const response = await createPost(formData);

    setIsLoading(false);

    if (response.success) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="colored">Create New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new post</DialogTitle>
            <DialogDescription>
              Create a new blog post for your site.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="My Awesome Post"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content here..."
                className="col-span-3"
                rows={5}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
