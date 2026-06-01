export function getSupabaseStatus() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasPublishable = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const hasServiceRole = serviceRole.startsWith("eyJ") || serviceRole.startsWith("sb_secret_");

  return {
    hasUrl,
    hasPublishable,
    hasServiceRole,
    connected: hasUrl && hasPublishable,
    message:
      hasUrl && hasPublishable
        ? hasServiceRole
          ? "Supabase connected with server service role."
          : "Supabase client is connected, but the server secret key is missing or invalid."
        : "Supabase environment variables are missing."
  };
}
