import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
      reviews: { include: { user: { select: { name: true, image: true } } } },
    },
  });

  if (!product || !product.published) notFound();

  const categoryIds = product.categories.map((c) => c.categoryId);
  const relatedProducts = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: product.id },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    take: 4,
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
      reviews: { select: { rating: true } },
    },
  });

  const mapped = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    categories: product.categories.map((c) => c.category),
    reviews: product.reviews.map((r) => ({
      ...r,
      rating: r.rating,
    })),
  };

  const relatedMapped = relatedProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    categories: p.categories.map((c) => c.category),
    rating: p.reviews.length
      ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
      : null,
    reviewCount: p.reviews.length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <ProductDetail product={mapped} />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Products</h2>
          <ProductGrid products={relatedMapped} />
        </section>
      )}
    </div>
  );
}
