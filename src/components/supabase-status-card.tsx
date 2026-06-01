"use client";

import { useEffect, useState } from "react";

type Status = {
  connected: boolean;
  hasServiceRole: boolean;
  message: string;
};

export function SupabaseStatusCard() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/admin/health")
      .then((response) => response.json())
      .then(setStatus)
      .catch(() => setStatus({ connected: false, hasServiceRole: false, message: "Cannot read Supabase status." }));
  }, []);

  if (!status) {
    return <div className="h-24 animate-pulse rounded-lg bg-black/10" />;
  }

  return (
    <div className={`rounded-lg border p-5 ${status.hasServiceRole ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
      <p className={`text-sm font-bold uppercase tracking-wide ${status.hasServiceRole ? "text-green-700" : "text-orange-700"}`}>
        {status.connected ? "Supabase detected" : "Supabase not connected"}
      </p>
      <p className="mt-2 text-sm leading-6 text-cocoa">{status.message}</p>
      {!status.hasServiceRole ? (
        <p className="mt-2 text-xs leading-5 text-cocoa">
          `SUPABASE_SERVICE_ROLE_KEY` must be a real server key from Settings / API Keys: either a legacy service_role JWT starting with `eyJ...` or a new secret key starting with `sb_secret_...`. The project ref is not a service role key.
        </p>
      ) : null}
    </div>
  );
}
