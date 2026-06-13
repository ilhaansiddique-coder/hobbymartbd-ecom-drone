import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} - Hobby Mart Blog` };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="mx-auto max-w-4xl px-4 pt-8 lg:px-8">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-gray-500 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{post.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {post.image && (
        <div className="mx-auto max-w-5xl px-4 lg:px-8 mb-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="prose prose-lg prose-blue max-w-none">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
