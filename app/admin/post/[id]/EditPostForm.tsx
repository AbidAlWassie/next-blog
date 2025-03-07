"use client";

import type React from "react";

import { TiptapEditor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { editPost } from "../../site/[id]/actions";

type Post = {
  id: string;
  title: string;
  content: string;
  siteId: string;
};

export function EditPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("postId", post.id);
    formData.append("title", title);
    formData.append("content", content);
    const response = await editPost(formData);
    setIsLoading(false);
    if (response.success) {
      router.push(`/admin/site/${post.siteId}`);
      toast.success("Post saved successfully!");
    } else {
      toast.error("Failed to save post.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="content" className="text-right pt-2">
            Content
          </label>
          <div className="col-span-3">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Write your post content here..."
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="colored" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
