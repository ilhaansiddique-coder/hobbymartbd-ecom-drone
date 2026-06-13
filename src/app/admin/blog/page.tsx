"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchBar } from "@/components/admin/search-bar";
import { ConfirmModal } from "@/components/admin/confirm-modal";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

function BlogListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const [data, setData] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/blog?${params}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const json = await res.json();
      setData(json.posts);
      setTotalPages(json.totalPages);
      setTotal(json.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set("search", query);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/admin/blog?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`/admin/blog?${params}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/blog/${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || "Failed to delete");
    }
    toast.success("Post deleted");
    setDeleteId(null);
    fetchPosts();
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      cell: (post: BlogPost) => (
        <Link href={`/admin/blog/${post.id}`} className="font-medium text-blue-600 hover:text-blue-700">
          {post.title}
        </Link>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (post: BlogPost) => <span className="text-gray-500">{post.author}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (post: BlogPost) => (
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
            post.published
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {post.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      cell: (post: BlogPost) =>
        post.featured ? (
          <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
            Featured
          </span>
        ) : null,
    },
    {
      key: "excerpt",
      header: "Excerpt",
      cell: (post: BlogPost) => (
        <span className="text-gray-500 line-clamp-1 max-w-xs">
          {post.excerpt || "\u2014"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (post: BlogPost) => (
        <span className="text-gray-500 whitespace-nowrap">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (post: BlogPost) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/blog/${post.id}`}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => setDeleteId(post.id)}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Blog Posts {total > 0 && <span className="text-base font-normal text-gray-400">({total})</span>}
        </h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Search posts..."
          onSearch={handleSearch}
          defaultValue={search}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchPosts} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyMessage="No blog posts found."
            keyExtractor={(post) => post.id}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null); }}
        title="Delete Blog Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading...</div>}>
      <BlogListContent />
    </Suspense>
  );
}
