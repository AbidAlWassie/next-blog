"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePost, deleteSite } from "../actions";

interface DeleteConfirmationProps {
  id: string;
  type: "site" | "post";
  name?: string;
  onSuccess?: () => void;
}

export function DeleteConfirmation({
  id,
  type,
  name,
  onSuccess,
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (type === "site") {
        const formData = new FormData();
        formData.append("siteId", id);
        await deleteSite(formData);
        router.push("/admin/dashboard");
      } else {
        const formData = new FormData();
        formData.append("postId", id);
        await deletePost(formData);
        router.refresh();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const title = type === "site" ? "Delete Site" : "Delete Post";
  const description =
    type === "site"
      ? `Are you sure you want to delete "${
          name || "this site"
        }"? This action cannot be undone and will delete all posts associated with this site.`
      : `Are you sure you want to delete this post? This action cannot be undone.`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete {type === "site" ? "Site" : ""}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
