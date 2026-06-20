"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/button";
import { clearCart } from "@/lib/cart";
import { getCurrentUser, logoutDemoUser } from "@/lib/demo-auth";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    setName(user?.name || window.localStorage.getItem("deluna_profile_name") || "");
    setEmail(user?.email || window.localStorage.getItem("deluna_profile_email") || "");
    setPhone(window.localStorage.getItem("deluna_profile_phone") || "");
    setAddress(window.localStorage.getItem("deluna_profile_address") || "");
  }, []);

  function save() {
    window.localStorage.setItem("deluna_profile_name", name);
    window.localStorage.setItem("deluna_profile_email", email);
    window.localStorage.setItem("deluna_profile_phone", phone);
    window.localStorage.setItem("deluna_profile_address", address);
    window.dispatchEvent(new Event("storage"));
  }

  function logout() {
    logoutDemoUser();
    ["deluna_profile_phone", "deluna_profile_address"].forEach((key) => window.localStorage.removeItem(key));
    clearCart();
    router.push("/");
  }

  if (!email) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-4xl font-semibold text-ink">Profiel / Profile</h1>
        <p className="mt-4 text-cocoa">Log in to keep order history, saved delivery information, and faster checkout.</p>
        <LinkButton href="/login" className="mt-6">Login or sign up</LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cocoa">Account</p>
          <h1 className="mt-3 break-words text-3xl font-semibold text-ink sm:text-4xl">Welkom, {name}</h1>
        </div>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form action={save} className="rounded-lg border border-black/10 bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Name<input value={name} onChange={(event) => setName(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold">Email<input value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Address<textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} className="focus-ring mt-2 w-full rounded-md border border-black/15 px-4 py-3" /></label>
          </div>
          <Button className="mt-6">Save profile</Button>
        </form>
        <div className="rounded-lg bg-ink p-6 text-white">
          <h2 className="text-xl font-semibold">Order history</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">When Supabase is connected, this panel reads only the logged-in customer's orders using RLS.</p>
          <LinkButton href="/orders" variant="gold" className="mt-5">View tracking</LinkButton>
        </div>
      </div>
    </div>
  );
}
