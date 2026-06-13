import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export type AdminRole = "ADMIN" | "STAFF";

export async function checkAdmin(allowedRoles: AdminRole[] = ["ADMIN", "STAFF"]) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as string | undefined;
  
  if (!session || !role || !allowedRoles.includes(role as AdminRole)) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  
  return { error: null, session };
}

export function requireAdmin(allowedRoles: AdminRole[] = ["ADMIN", "STAFF"]) {
  return async () => {
    const result = await checkAdmin(allowedRoles);
    if (result.error) throw result.error;
    return result.session;
  };
}
