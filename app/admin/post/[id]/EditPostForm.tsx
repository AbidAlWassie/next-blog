"use client";

import type React from "react";

import { TiptapEditor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { editPost } from "../../site/[id]/actions";

// Update the Post type to include tags
type Post = {
  id: string;
  title: string;
  content: string;
  siteId: string;
  tags: string[];
};

export function EditPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Add state for tags
  const [tags, setTags] = useState(post.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Add this function to handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Add this function to remove tags
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("postId", post.id);
    formData.append("title", title);
    formData.append("content", content);
    // In the handleSubmit function, add tags to formData
    formData.append("tags", JSON.stringify(tags));
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
        {/* Add this to the form, after the content field */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="tags" className="text-right pt-2">
            Tags
          </label>
          <div className="col-span-3">
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-muted rounded-full px-2 py-1 text-xs flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (press Enter to add)"
              className="w-full"
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
