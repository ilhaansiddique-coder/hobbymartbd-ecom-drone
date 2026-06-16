"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  onChanged,
}: {
  orderId: string;
  currentStatus: string;
  onChanged?: (status: string) => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);

  // Keep in sync if the parent re-renders with a new status (e.g. after refresh).
  useEffect(() => setValue(currentStatus), [currentStatus]);

  const handleChange = async (next: string | null) => {
    if (!next || next === value) return;
    const prev = value;
    setValue(next); // optimistic: update the dropdown immediately
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated");
      onChanged?.(next); // let client-rendered lists refresh their data
      router.refresh(); // refresh server-rendered pages
    } catch {
      setValue(prev); // revert on failure
      toast.error("Failed to update status");
    }
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
