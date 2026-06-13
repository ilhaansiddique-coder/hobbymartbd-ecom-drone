"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { SearchBar } from "@/components/admin/search-bar";
import { UserRoleSelect, UserDeleteButton } from "@/components/admin/role-update";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  STAFF: "bg-blue-100 text-blue-700",
  USER: "bg-gray-100 text-gray-600",
};

interface UserCount {
  orders: number;
  reviews: number;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: UserCount;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const currentUserId = (session?.user as any)?.id;

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (user: User) => (
        <Link href={`/admin/users/${user.id}`} className="font-medium text-blue-600 hover:text-blue-800">
          {user.name || "N/A"}
        </Link>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (user: User) => <span className="text-gray-500">{user.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[user.role] || ""}`}>
            {user.role}
          </span>
          <UserRoleSelect userId={user.id} currentRole={user.role} />
        </div>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      cell: (user: User) => <span className="text-gray-500">{user._count.orders}</span>,
    },
    {
      key: "reviews",
      header: "Reviews",
      cell: (user: User) => <span className="text-gray-500">{user._count.reviews}</span>,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (user: User) => <span className="text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          {user.id !== currentUserId && <UserDeleteButton userId={user.id} />}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New User
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar placeholder="Search by name or email..." onSearch={handleSearch} defaultValue={search} />
      </div>

      {error && (
        <div className="rounded-2xl border bg-red-50 p-4 text-sm text-red-700 mb-4">{error}</div>
      )}

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
        keyExtractor={(user: User) => user.id}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
