"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/button";
import { createPasswordResetCode, findDemoUser, loginDemoUser, resetDemoPassword, setCurrentUser, signupDemoUser } from "@/lib/demo-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const search = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup" | "reset">(search.get("mode") === "signup" ? "signup" : "login");
  const [message, setMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [devCode, setDevCode] = useState("");
  const configured = isSupabaseConfigured();

  async function submit(formData: FormData) {
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    try {
      if (mode === "reset") {
        const code = String(formData.get("code") || "");
        const nextPassword = String(formData.get("newPassword") || "");
        if (!code) {
          const resetCode = createPasswordResetCode(email);
          setResetEmail(email);
          setDevCode(resetCode);
          setMessage("A 6-digit reset code has been generated. In production this code should be sent by email.");
          return;
        }
        if (nextPassword.length < 8) throw new Error("New password must be at least 8 characters.");
        resetDemoPassword(email, code, nextPassword);
        setMessage("Password updated. You can log in with the new password now.");
        setMode("login");
        return;
      }

      const localUser = findDemoUser(email);
      if (mode === "login" && localUser) {
        const user = loginDemoUser(email, password);
        setMessage(`Welcome ${user.name}. Your account is ready.`);
        window.location.href = user.role === "admin" ? "/admin" : "/profile";
        return;
      }

      if (configured) {
        const supabase = createClient();
        const result =
          mode === "login"
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (result.error) throw new Error(result.error.message);
      }
      const user =
        mode === "login"
          ? { name: email.split("@")[0], email, password, role: "customer" as const }
          : signupDemoUser({ name: name || email.split("@")[0], email, password });
      if (mode === "login") setCurrentUser(user);
      setMessage(`Welcome ${user.name}. Your account is ready.`);
      window.location.href = user.role === "admin" ? "/admin" : "/profile";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue.");
    }
  }

  async function googleLogin() {
    if (!configured) {
      setMessage("Google login needs Supabase keys. Email/password demo login is available now.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr]">
      <div className="rounded-lg bg-ink p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-champagne">Deluna account</p>
        <h1 className="mt-4 text-4xl font-semibold">Save your profile, order history, and custom details.</h1>
        <p className="mt-5 leading-7 text-white/75">
          Customers get profile and order history. Admin users get the admin dashboard option in the account dropdown.
        </p>
        <div className="mt-8 rounded-lg bg-white/10 p-4 text-sm">
          Admin demo: admin@deluna.local / Deluna@2026
        </div>
      </div>
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-soft">
        <div className="grid grid-cols-3 rounded-md bg-linen p-1">
          <button onClick={() => setMode("login")} className={`rounded px-4 py-3 text-sm font-bold ${mode === "login" ? "bg-white shadow-sm" : ""}`}>Login</button>
          <button onClick={() => setMode("signup")} className={`rounded px-4 py-3 text-sm font-bold ${mode === "signup" ? "bg-white shadow-sm" : ""}`}>Create account</button>
          <button onClick={() => setMode("reset")} className={`rounded px-4 py-3 text-sm font-bold ${mode === "reset" ? "bg-white shadow-sm" : ""}`}>Forgot</button>
        </div>
        <form action={submit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-semibold text-ink">Full name<input name="name" required className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
          ) : null}
          <label className="block text-sm font-semibold text-ink">Email<input name="email" type="email" required defaultValue={mode === "login" ? "admin@deluna.local" : resetEmail} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
          {mode === "reset" ? (
            <>
              <label className="block text-sm font-semibold text-ink">Verification code<input name="code" inputMode="numeric" placeholder="Leave empty to request code" className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
              <label className="block text-sm font-semibold text-ink">New password<input name="newPassword" type="password" minLength={8} placeholder="At least 8 characters" className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            </>
          ) : (
            <label className="block text-sm font-semibold text-ink">Password<input name="password" type="password" required defaultValue={mode === "login" ? "Deluna@2026" : ""} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
          )}
          <Button className="w-full">{mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send / verify code"}</Button>
        </form>
        {mode !== "reset" ? (
          <Button onClick={googleLogin} variant="secondary" className="mt-4 w-full">
            <FcGoogle /> Continue with Google
          </Button>
        ) : null}
        {message ? <p className="mt-4 rounded-md bg-linen p-3 text-sm text-cocoa">{message}</p> : null}
        {devCode ? <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">Development reset code: {devCode}</p> : null}
      </div>
    </div>
  );
}
