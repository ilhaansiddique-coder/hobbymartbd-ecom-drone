"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        if (!confirm("Are you sure?")) return;
        try {
          const res = await fetch(url, { method: "DELETE" });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to delete");
          }
          toast.success("Deleted successfully");
          router.refresh();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
      }}
      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
    >
      {label}
    </button>
  );
}
