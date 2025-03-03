"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type React from "react";
import { useState } from "react";

export function Dropdown({
  trigger,
  children,
  title = "Edit Site",
  description = "Make changes to your site settings.",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex justify-end mb-4">
        <CollapsibleTrigger asChild>
          <div>{trigger}</div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
