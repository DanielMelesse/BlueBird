"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, getShippingCost } from "@/lib/products";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isReady: authReady } = useAuth();
  const { items, subtotal, clearCart, isReady: cartReady } = useCart();
  const [placed, setPlaced] = useState(false);

  if (!cartReady) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    );
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-zinc-500">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-brand-600 hover:underline">
          Go to shop
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl" aria-hidden>
          ✓
        </p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">Order placed!</h1>
        <p className="mt-2 text-zinc-500">
          Thank you{user ? `, ${user.name}` : ""}. This is a demo — no real charge
          was made.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearCart();
    setPlaced(true);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">Checkout</h1>
      {cartReady && authReady && !user && (
        <p className="mt-2 text-sm text-zinc-500">
          <Link href="/login" className="text-brand-600 hover:underline">
            Log in
          </Link>{" "}
          for a faster experience (optional for demo).
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
          <legend className="px-1 text-sm font-semibold text-zinc-900">
            Shipping address
          </legend>
          <input
            required
            name="name"
            placeholder="Full name"
            defaultValue={user?.name ?? ""}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          />
          <input
            required
            name="address"
            placeholder="Street address"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              name="city"
              placeholder="City"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
            />
            <input
              required
              name="zip"
              placeholder="ZIP code"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
          <legend className="px-1 text-sm font-semibold text-zinc-900">
            Payment (demo)
          </legend>
          <input
            required
            name="card"
            placeholder="Card number"
            defaultValue="4242 4242 4242 4242"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              name="expiry"
              placeholder="MM/YY"
              defaultValue="12/28"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
            />
            <input
              required
              name="cvc"
              placeholder="CVC"
              defaultValue="123"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
            />
          </div>
        </fieldset>

        <div className="rounded-2xl bg-zinc-900 p-6 text-white">
          <p className="text-sm text-zinc-400">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
          <p className="mt-2 text-2xl font-bold">{formatPrice(total)}</p>
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold hover:bg-brand-500"
          >
            Place order
          </button>
        </div>
      </form>
    </div>
  );
}
