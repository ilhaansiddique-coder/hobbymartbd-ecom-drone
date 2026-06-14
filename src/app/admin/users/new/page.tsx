"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function NewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "USER", phone: "", address: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      toast.success("User created");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/users" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New User</h1>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input type="email" required className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="user@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <input type="text" required minLength={6} className={inputClass} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
            <select className={inputClass} value={form.role} onChange={(e) => set("role", e.target.value)}>
              <option value="USER">User (customer)</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+880 1XXX XXXXXX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
            <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="City, area" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/admin/users" className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create user
          </button>
        </div>
      </form>
    </div>
  );
}
