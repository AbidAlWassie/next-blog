// app\admin\site\[id]\Dropdown.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { editSite } from "./actions";

type Site = {
  id: string;
  name: string;
  description?: string;
  subdomain: string;
};

export function EditSiteForm({ site }: { site: Site }) {
  const [name, setName] = useState(site.name);
  const [description, setDescription] = useState(site.description || "");
  const [subdomain, setSubdomain] = useState(site.subdomain);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("siteId", site.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("subdomain", subdomain);
    const response = await editSite(formData);
    setIsLoading(false);
    if (response.success) {
      router.push(`/admin/site/${site.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="description" className="text-right">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="subdomain" className="text-right">
            Subdomain
          </label>
          <Input
            id="subdomain"
            name="subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            className="col-span-3"
            required
          />
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
