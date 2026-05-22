"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [parentCategories, setParentCategories] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
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
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
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
