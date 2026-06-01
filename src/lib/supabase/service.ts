import { createClient } from "@supabase/supabase-js";

export function hasSupabaseServerConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("eyJ") ||
        process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("sb_secret_"))
  );
}

export function createServiceClient() {
  if (!hasSupabaseServerConfig()) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
