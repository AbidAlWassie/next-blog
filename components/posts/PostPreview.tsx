"use client";

import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PostPreviewProps {
  content: string;
  title: string;
  tags?: string[];
  className?: string;
}

export function PostPreview({
  content,
  title,
  tags = [],
  className,
}: PostPreviewProps) {
  // Extract the first image from the content
  const getFirstImage = (htmlContent: string): string | null => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const img = div.querySelector("img");
    return img?.src || null;
  };

  // Generate placeholder URL with the post title as text
  const generatePlaceholderUrl = (title: string) => {
    const encodedTitle = encodeURIComponent(title);
    return `https://holdmyimage.netlify.app/api/image/1280x720/1f788e/e7edee?text=${encodedTitle}&font=Roboto&pattern=waves&patternDensity=120&gradient=a733c7%2C1bb2c5&direction=horizontal&format=svg`;
  };

  const imageUrl = getFirstImage(content) || generatePlaceholderUrl(title);

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <div className="flex flex-wrap gap-1">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <Tag key={index} variant="ghost" className="text-xs border">
              {tag}
            </Tag>
          ))
        ) : (
          <Tag variant="ghost" className="text-xs border opacity-0">
            {"No tags"}
          </Tag>
        )}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>
    </div>
  );
}
