"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { SearchBar } from "@/components/admin/search-bar";
import { Pagination } from "@/components/admin/pagination";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  parent: { name: string } | null;
  _count: { products: number };
}

interface PaginatedResponse {
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/categories?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/categories?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/admin/categories?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    toast.success("Category deleted");
    setDeleteTarget(null);
    fetchCategories();
  };

  const columns = [
    {
      key: "image",
      header: "Image",
      cell: (cat: Category) =>
        cat.image ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image src={cat.image} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-100" />
        ),
    },
    {
      key: "name",
      header: "Name",
      cell: (cat: Category) => <span className="font-medium">{cat.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      cell: (cat: Category) => <span className="text-gray-500">{cat.slug}</span>,
    },
    {
      key: "description",
      header: "Description",
      cell: (cat: Category) => (
        <span className="max-w-xs truncate block text-gray-500">
          {cat.description || "\u2014"}
        </span>
      ),
    },
    {
      key: "parent",
      header: "Parent",
      cell: (cat: Category) => (
        <span className="text-gray-500">{cat.parent?.name || "\u2014"}</span>
      ),
    },
    {
      key: "products",
      header: "Products",
      cell: (cat: Category) => <span className="text-gray-500">{cat._count.products}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (cat: Category) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/categories/${cat.id}`}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Category
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Search categories..."
          onSearch={handleSearch}
          defaultValue={search}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchCategories} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.categories || []}
            loading={loading}
            emptyMessage="No categories found"
            keyExtractor={(cat) => cat.id}
          />
          {data && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
