import { createServiceClient, hasSupabaseServerConfig } from "@/lib/supabase/service";

export async function saveNewsletterConsent(input: {
  email: string;
  name?: string;
  source: string;
  locale?: string;
  consent?: boolean;
}) {
  if (!input.consent || !input.email || !hasSupabaseServerConfig()) return;

  const supabase = createServiceClient();
  await supabase.from("newsletter_subscribers").upsert(
    {
      email: input.email.toLowerCase(),
      name: input.name || null,
      source: input.source,
      locale: input.locale || null,
      consent: true,
      consent_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { onConflict: "email" }
  );
}

