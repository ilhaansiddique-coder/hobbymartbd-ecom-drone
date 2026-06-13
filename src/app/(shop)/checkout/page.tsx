"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/hooks/use-cart";
import { toast } from "sonner";

const checkoutSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  address: z.string().min(10, { message: "Please enter your full delivery address." }),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || "",
      phone: "",
      address: "",
      note: "",
    },
  });

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="mt-8 lg:mt-0">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Please sign in to checkout</h1>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <Link href="/products"><Button>Shop Now</Button></Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);

    const orderData = {
      items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      ...data,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        await clearCart();
        toast.success("Order placed successfully!");
        router.push("/orders");
      } else {
        toast.error("Failed to place order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+880 1XXX XXXXXX" {...register("phone")} />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea id="address" placeholder="Full address with area, city" {...register("address")} />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="note">Order Note (optional)</Label>
                <Textarea id="note" placeholder="Special instructions for delivery" {...register("note")} />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Placing Order..." : `Place Order - ${formatPrice(subtotal)}`}
          </Button>
        </form>

        <div className="mt-8 lg:mt-0">
          <div className="rounded-2xl border bg-white p-6 shadow-sm sticky top-8">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 border">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
