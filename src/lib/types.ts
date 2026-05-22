import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "STAFF" | "ADMIN";
    } & DefaultSession["user"];
  }
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  quantity: number;
  slug: string;
  stock: number;
}

export interface CompareItem {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  slug: string;
  specs: Record<string, any> | null;
}
