"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchBar } from "@/components/admin/search-bar";
import { DeleteButton } from "@/components/admin/delete-button";

interface ReviewUser {
  name: string | null;
  email: string;
}

interface ReviewProduct {
  name: string;
  slug: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: ReviewUser;
  product: ReviewProduct;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/reviews?${params}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const columns = [
    {
      key: "product",
      header: "Product",
      cell: (review: Review) => <span className="font-medium">{review.product.name}</span>,
    },
    {
      key: "user",
      header: "User",
      cell: (review: Review) => <span className="text-gray-500">{review.user.name || "Anonymous"}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      cell: (review: Review) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
          ))}
          <span className="ml-1 text-xs text-gray-500">({review.rating})</span>
        </div>
      ),
    },
    {
      key: "comment",
      header: "Comment",
      cell: (review: Review) => (
        <span className="text-gray-500 max-w-xs truncate block">
          {review.comment
            ? review.comment.length > 50
              ? review.comment.slice(0, 50) + "..."
              : review.comment
            : "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (review: Review) => (
        <span className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (review: Review) => (
        <DeleteButton url={`/api/admin/reviews/${review.id}`} label="Delete" />
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h1>

      <div className="mb-4">
        <SearchBar placeholder="Search by product, user, or comment..." onSearch={handleSearch} defaultValue={search} />
      </div>

      {error && (
        <div className="rounded-2xl border bg-red-50 p-4 text-sm text-red-700 mb-4">{error}</div>
      )}

      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        emptyMessage="No reviews found"
        keyExtractor={(review: Review) => review.id}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
