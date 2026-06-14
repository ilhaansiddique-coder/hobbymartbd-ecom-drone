"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadDropzone } from "@/components/admin/local-upload";
import { RichEditor } from "@/components/admin/rich-editor";
import { slugify } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "0",
    images: "",
    specs: "",
    featured: false,
    published: true,
    categoryIds: [] as string[],
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const initialFormRef = useRef(JSON.stringify(form));

  const isDirty = JSON.stringify(form) !== initialFormRef.current;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !slugManuallyEdited) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  const handleSlugRegenerate = () => {
    setSlugManuallyEdited(false);
    setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
  };

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

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          description: form.description,
          price: form.price,
          salePrice: form.salePrice || null,
          stock: parseInt(form.stock),
          images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
          specs,
          featured: form.featured,
          published: form.published,
          categoryIds: form.categoryIds,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      toast.success("Product created");
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

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug
            {slugManuallyEdited && (
              <button
                type="button"
                onClick={handleSlugRegenerate}
                className="ml-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="h-3 w-3" />
                Reset to auto
              </button>
            )}
          </label>
          <Input
            value={form.slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              setForm((prev) => ({ ...prev, slug: e.target.value }));
            }}
            placeholder="auto-generated from name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <RichEditor
            value={form.description}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            placeholder="Write product description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sale Price</label>
            <Input
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => setForm((prev) => ({ ...prev, salePrice: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <Input
              value=""
              disabled
              placeholder="auto-generated on save"
            />
            <p className="mt-1 text-xs text-gray-400">SKU is auto-generated based on name and category</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50/50">
            <UploadDropzone
              endpoint="productImage"
              onClientUploadComplete={(res) => {
                const urls = res.map((file) => file.url).join(",");
                setForm((prev) => ({
                  ...prev,
                  images: prev.images ? `${prev.images},${urls}` : urls,
                }));
                toast.success("Image(s) uploaded successfully!");
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
              className="ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-600/50 ut-button:hover:bg-blue-700 ut-label:text-blue-600 border-none"
            />
          </div>
          {form.images && (
            <div className="mt-4 flex flex-wrap gap-4">
              {form.images.split(",").map((url, idx) => (
                <div key={idx} className="relative h-24 w-24 overflow-hidden rounded-lg border shadow-sm">
                  <Image src={url} alt={`Preview ${idx}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = form.images.split(",").filter((_, i) => i !== idx).join(",");
                      setForm({ ...form, images: newImages });
                    }}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-80 hover:opacity-100"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specs (JSON)</label>
          <Input
            value={form.specs}
            onChange={(e) => setForm((prev) => ({ ...prev, specs: e.target.value }))}
            placeholder='{"brand": "DJI", "weight": "249g"}'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          {categoriesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-32" />
              ))}
            </div>
          ) : (
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
          )}
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

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">SEO</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meta Title</label>
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="SEO title (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Meta Description</label>
              <Input
                value={form.metaDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="SEO description (optional)"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
