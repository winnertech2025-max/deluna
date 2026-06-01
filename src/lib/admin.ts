import { cookies } from "next/headers";

export const adminCookieName = "deluna_admin";

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(adminCookieName)?.value === "ok";
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@deluna.local",
    password: process.env.ADMIN_PASSWORD || "Deluna@2026"
  };
}
