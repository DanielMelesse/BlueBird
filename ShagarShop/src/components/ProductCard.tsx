"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 transition group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
          <span className="text-amber-500">★</span>
          <span>{product.rating}</span>
          <span>({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-lg font-bold text-zinc-900">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
