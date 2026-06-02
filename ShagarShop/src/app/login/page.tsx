"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const AFTER_AUTH_PATH = "/shop?featured=1";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isReady } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && user) router.replace(AFTER_AUTH_PATH);
  }, [isReady, user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      router.push(AFTER_AUTH_PATH);
    } else {
      setError("Enter a valid email address.");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">Log in</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Demo auth — any email with @ and any password works.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
