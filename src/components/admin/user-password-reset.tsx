"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

export function UserPasswordReset({ userId }: { userId: string }) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      toast.success("Password has been reset");
      setPassword("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <KeyRound className="h-4 w-4" /> Reset Password
      </h3>
      <p className="mb-3 text-xs text-gray-500">Set a new password for this user.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min 6 characters)"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={reset}
          disabled={saving || !password}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Reset
        </button>
      </div>
    </div>
  );
}
