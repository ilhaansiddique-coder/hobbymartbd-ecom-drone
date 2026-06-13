"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { slugify } from "@/lib/utils";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [parentCategories, setParentCategories] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, catDataRes] = await Promise.all([
          fetch(`/api/admin/categories/${params.id}`),
          fetch("/api/admin/categories"),
        ]);

        const catData = await catDataRes.json();
        const allCats = (catData.categories || []).filter((c: any) => c.id !== params.id);
        setParentCategories(allCats);

        const data = await catRes.json();
        const cat = data.category;
        setName(cat.name || "");
        setSlug(cat.slug || "");
        setDescription(cat.description || "");
        setImage(cat.image || "");
        setParentId(cat.parentId || "");
      } catch {
        toast.error("Failed to load category");
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [params.id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || undefined,
          description,
          image: image || undefined,
          parentId: parentId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update category");
      }

      toast.success("Category updated");
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-4 rounded-2xl border bg-white p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input value={name} onChange={handleNameChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <div className="rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50/50">
            <UploadDropzone
              endpoint="productImage"
              onClientUploadComplete={(res) => {
                setImage(res[0].url);
                toast.success("Image uploaded successfully!");
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
              className="ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-600/50 ut-button:hover:bg-blue-700 ut-label:text-blue-600 border-none"
            />
          </div>
          {image && (
            <div className="mt-4 relative h-32 w-32 overflow-hidden rounded-lg border shadow-sm">
              <Image src={image} alt="Category preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-80 hover:opacity-100"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Parent Category</label>
          <Select value={parentId} onValueChange={(v) => setParentId(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None (top level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None (top level)</SelectItem>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
