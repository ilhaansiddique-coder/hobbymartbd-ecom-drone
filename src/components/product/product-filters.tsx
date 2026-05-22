"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  categories: { name: string; slug: string }[];
  currentCategory?: string;
}

export function ProductFilters({ categories, currentCategory }: ProductFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
        <div className="space-y-1">
          <Link
            href="/products"
            className={`block rounded-lg px-3 py-2 text-sm ${
              !currentCategory ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`block rounded-lg px-3 py-2 text-sm ${
                currentCategory === cat.slug
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Sort By</h3>
        <div className="space-y-1">
          {[
            { label: "Newest", value: "newest" },
            { label: "Price: Low to High", value: "price-asc" },
            { label: "Price: High to Low", value: "price-desc" },
            { label: "Name", value: "name" },
          ].map((option) => (
            <Link
              key={option.value}
              href={`/products?sort=${option.value}${currentCategory ? `&category=${currentCategory}` : ""}`}
              className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
