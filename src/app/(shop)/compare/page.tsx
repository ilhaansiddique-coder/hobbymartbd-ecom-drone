"use client";

import { useCompare } from "@/lib/hooks/use-compare";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const { items, toggleItem } = useCompare();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <BarChart3 className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold">No products to compare</h1>
        <p className="mb-8 text-gray-500">Add products to compare their specs side by side.</p>
        <Link href="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  const allSpecKeys = [...new Set(items.flatMap((i: any) => i.specs ? Object.keys(i.specs) : []))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Compare Products</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-40 p-4 text-left text-sm font-medium text-gray-500">Product</th>
              {items.map((item: any) => (
                <th key={item.id} className="min-w-[200px] p-4 text-center">
                  <div className="relative mx-auto mb-3 aspect-square w-40 overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={item.images?.[0] || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:text-blue-600">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold">
                    {item.salePrice ? formatPrice(item.salePrice) : formatPrice(item.price)}
                    {item.salePrice && (
                      <span className="ml-1 text-xs text-gray-400 line-through">{formatPrice(item.price)}</span>
                    )}
                  </p>
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-2 rounded-lg p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSpecKeys.map((key) => (
              <tr key={key} className="border-t">
                <td className="p-4 text-sm font-medium text-gray-500 capitalize">{key}</td>
                {items.map((item: any) => (
                  <td key={item.id} className="p-4 text-center text-sm">
                    {item.specs?.[key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
