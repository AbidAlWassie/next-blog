"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editPost } from "../../site/[id]/actions";

export function EditPostForm({ post }: { post: any }) {
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
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="content" className="text-right">
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="col-span-3"
            rows={5}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
