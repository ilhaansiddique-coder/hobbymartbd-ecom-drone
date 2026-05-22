"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "0",
    images: "",
    specs: "",
    featured: false,
    published: true,
    categoryIds: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch(`/api/admin/products/${params.id}`),
        ]);

        const catData = await catRes.json();
        setCategories(catData.categories || []);

        const prodData = await prodRes.json();
        const p = prodData.product;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price?.toString() || "",
          salePrice: p.salePrice?.toString() || "",
          stock: p.stock?.toString() || "0",
          images: (p.images || []).join(", "),
          specs: p.specs ? JSON.stringify(p.specs, null, 2) : "",
          featured: p.featured || false,
          published: p.published ?? true,
          categoryIds: (p.categories || []).map((c: any) => c.category?.id || c.id),
        });
      } catch {
        toast.error("Failed to load product");
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
      let specs = undefined;
      if (form.specs.trim()) {
        try {
          specs = JSON.parse(form.specs);
        } catch {
          toast.error("Invalid JSON in specs field");
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: form.price,
          salePrice: form.salePrice || null,
          stock: parseInt(form.stock),
          images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
          specs,
          featured: form.featured,
          published: form.published,
          categoryIds: form.categoryIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      toast.success("Product updated");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sale Price</label>
            <Input
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images (comma-separated URLs)</label>
          <Input
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specs (JSON)</label>
          <Textarea
            value={form.specs}
            onChange={(e) => setForm({ ...form, specs: e.target.value })}
            rows={4}
            placeholder='{"brand": "DJI", "weight": "249g"}'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  id={cat.id}
                  checked={form.categoryIds.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <Label htmlFor={cat.id}>{cat.name}</Label>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-gray-400">No categories available</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) => setForm({ ...form, featured: checked === true })}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="published"
              checked={form.published}
              onCheckedChange={(checked) => setForm({ ...form, published: checked === true })}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
