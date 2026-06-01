"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function login(formData: FormData) {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    if (response.ok) router.push("/admin");
    else setError("Invalid admin credentials.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form action={login} className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-semibold text-ink">Admin login</h1>
        <p className="mt-3 text-sm text-cocoa">Default: admin@deluna.local / Deluna@2026. Change it in .env.local.</p>
        <label className="mt-6 block text-sm font-semibold">Email<input name="email" defaultValue="admin@deluna.local" className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
        <label className="mt-4 block text-sm font-semibold">Password<input name="password" type="password" defaultValue="Deluna@2026" className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
        <Button className="mt-6 w-full">Enter admin</Button>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
