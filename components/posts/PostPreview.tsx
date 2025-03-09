"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface PostPreviewProps {
  content: string;
  className?: string;
  maxHeight?: string;
}

export function PostPreview({
  content,
  className,
  maxHeight = "150px",
}: PostPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add target="_blank" to all links
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={cn("prose max-w-none overflow-hidden relative", className)}
      style={{
        maxHeight,
        display: "-webkit-box",
        WebkitLineClamp: "4",
        WebkitBoxOrient: "vertical",
        textOverflow: "ellipsis",
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
