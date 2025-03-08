"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface PostContentProps {
  content: string;
  className?: string;
}

export function PostContent({ content, className }: PostContentProps) {
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
      className={cn("prose max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
