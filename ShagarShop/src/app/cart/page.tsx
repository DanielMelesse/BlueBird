"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  getShippingCost,
} from "@/lib/products";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, isReady } =
    useCart();

  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  if (!isReady) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-5xl" aria-hidden>
          🛒
        </p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">Your cart is empty</h1>
        <p className="mt-2 text-zinc-500">Add items to get started.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-900">
        Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <Link
                href={`/product/${product.id}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  href={`/product/${product.id}`}
                  className="font-medium text-zinc-900 hover:text-brand-600"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {formatPrice(product.price)}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-600">
                    Qty
                    <select
                      value={quantity}
                      onChange={(e) =>
                        updateQuantity(product.id, Number(e.target.value))
                      }
                      className="rounded border border-zinc-300 px-2 py-1"
                    >
                      {Array.from(
                        { length: Math.min(product.stock, 10) },
                        (_, i) => i + 1,
                      ).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="shrink-0 font-semibold text-zinc-900">
                {formatPrice(product.price * quantity)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-semibold text-zinc-900">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-brand-700">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for
                free shipping
              </p>
            )}
            <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
