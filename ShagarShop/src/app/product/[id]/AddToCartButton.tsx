"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-xl bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-500 sm:w-auto"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
      className="w-full rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
    >
      {added ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}
