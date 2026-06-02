import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice, getProduct, products } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/shop" className="hover:text-brand-600">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
            <span className="text-amber-500">★ {product.rating}</span>
            <span>·</span>
            <span>{product.reviewCount.toLocaleString()} reviews</span>
          </div>
          <p className="mt-6 text-3xl font-bold text-zinc-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 leading-relaxed text-zinc-600">{product.description}</p>
          <p className="mt-4 text-sm text-zinc-500">
            {product.stock > 0 ? (
              <span className="text-brand-700">
                In stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
