"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Tags, Users, Star, FileText, Settings, UserCog, LogOut, Loader2, Menu, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "STAFF") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:flex lg:min-h-[80vh]">
      {/* Mobile topbar — sits just below the storefront header (h-16) so the
          admin menu is reachable on small screens. */}
      <div className="sticky top-16 z-30 flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin menu"
          className="rounded-lg border p-2 text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-base font-bold text-gray-900">Admin Panel</span>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 flex h-full w-64 flex-col bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>
        </div>
      )}
      <aside className="hidden w-64 shrink-0 border-r bg-gray-50 p-4 lg:flex lg:flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-200"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <div className="min-w-0 flex-1 p-4 lg:p-6">{children}</div>
    </div>
  );
}
