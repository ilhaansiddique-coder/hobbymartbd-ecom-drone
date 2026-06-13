"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { SearchBar } from "@/components/admin/search-bar";
import { Pagination } from "@/components/admin/pagination";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string[];
  published: boolean;
  categories: { id: string; name: string; slug: string }[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (page) params.set("page", page.toString());
      if (search) params.set("search", search);
      params.set("limit", "20");
      const res = await fetch(`/api/admin/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Product deleted");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "product",
      header: "Product",
      cell: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-gray-50">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <Link
            href={`/admin/products/${product.id}`}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {product.name}
          </Link>
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      cell: (product: Product) => (
        <span className="font-mono text-xs text-gray-500">{product.sku}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (product: Product) =>
        product.salePrice ? (
          <span>
            {formatPrice(product.salePrice)}{" "}
            <span className="text-gray-400 line-through">{formatPrice(product.price)}</span>
          </span>
        ) : (
          formatPrice(product.price)
        ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (product: Product) => (
        <span className={product.stock > 0 ? "text-gray-700" : "text-red-500"}>
          {product.stock}
        </span>
      ),
    },
    {
      key: "categories",
      header: "Categories",
      cell: (product: Product) => (
        <div className="flex flex-wrap gap-1">
          {product.categories.slice(0, 3).map((cat) => (
            <span
              key={cat.id}
              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
            >
              {cat.name}
            </span>
          ))}
          {product.categories.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              +{product.categories.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (product: Product) => (
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            product.published
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (product: Product) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteTarget(product)}
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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Search products by name or SKU..."
          onSearch={handleSearch}
          defaultValue={search}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products found"
        keyExtractor={(p) => p.id}
      />

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        variant="destructive"
      />
    </div>
  );
}
