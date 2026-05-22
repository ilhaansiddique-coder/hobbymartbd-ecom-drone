import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

// Reusing the same mock data for the individual post page
const blogPosts = [
  {
    id: 1,
    title: "Top 5 Drones for Beginners in 2026",
    content: "Starting your drone journey? We've compiled the ultimate list of the best beginner-friendly drones that balance features, durability, and price. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    category: "Guides",
    date: "May 20, 2026",
    author: "Alex Morgan",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "How to Maintain Your Drone Batteries",
    content: "Maximize the lifespan and performance of your LiPo batteries with these essential storage and charging tips. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    category: "Maintenance",
    date: "May 15, 2026",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "DJI Mavic 3 Pro: In-Depth Review",
    content: "Is the triple-camera setup worth the upgrade? We take the DJI Mavic 3 Pro for a spin to test its cinematic capabilities. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Reviews",
    date: "May 10, 2026",
    author: "David Ross",
    image: "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Understanding Drone Regulations",
    content: "Before you fly, make sure you know the local laws. A comprehensive guide to registration and no-fly zones. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "News",
    date: "May 5, 2026",
    author: "Emily White",
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "FPV Racing: How to Get Started",
    content: "Experience the thrill of First-Person View drone racing. Here's exactly what gear you need to build your first quadcopter. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    category: "Guides",
    date: "April 28, 2026",
    author: "Marcus Vance",
    image: "https://images.unsplash.com/photo-1581458852373-3c9902bd21e5?q=80&w=800&auto=format&fit=crop",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === parseInt(id));
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} - Hobby Mart Blog` };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === parseInt(id));

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
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 mb-4">
            {post.category}
          </span>
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
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </div>

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
