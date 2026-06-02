import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { FREE_SHIPPING_THRESHOLD, formatPrice, getFeaturedProducts } from "@/lib/products";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-brand-100">
              Welcome to ShagarShop
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Shop smarter.
              <br />
              <span className="text-brand-100">Delivered faster.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-brand-50/90">
              Thousands of products from electronics to fashion — curated deals,
              secure checkout, and free shipping on orders over{" "}
              {formatPrice(FREE_SHIPPING_THRESHOLD)}.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50 sm:px-10 sm:py-5 sm:text-lg"
              >
                Browse all products
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50 sm:px-10 sm:py-5 sm:text-lg"
              >
                Create account
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:block">
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80"
              alt="Shopping bags and packages"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Top Picks</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Top-rated products our customers love
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-2xl bg-zinc-900 p-8 text-white sm:grid-cols-3 sm:p-10">
          {[
            {
              title: "Free shipping",
              desc: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
            },
            { title: "Easy returns", desc: "5-day hassle-free policy" },
            { title: "Secure checkout", desc: "Encrypted payment processing" },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
