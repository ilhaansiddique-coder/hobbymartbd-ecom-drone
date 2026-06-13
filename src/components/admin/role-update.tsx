"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DeleteButton } from "./delete-button";

const roles = ["USER", "STAFF", "ADMIN"] as const;

export function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();

  const handleChange = async (value: string | null) => {
    if (!value) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: value }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      toast.success("Role updated");
      router.refresh();
    } catch {
      toast.error("Failed to update role");
    }
  };

  return (
    <Select value={currentRole} onValueChange={handleChange}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function UserDeleteButton({ userId }: { userId: string }) {
  return <DeleteButton url={`/api/admin/users/${userId}`} label="Delete" />;
}
