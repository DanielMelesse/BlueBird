import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import type { Category } from "@/lib/types";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; featured?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category as Category | undefined;
  const featuredOnly = params.featured === "1";
  const query = params.q?.toLowerCase().trim();

  let filtered = [...products];
  if (category && categories.some((c) => c.id === category)) {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (featuredOnly) {
    filtered = filtered.filter((p) => p.featured);
  }
  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  }

  const activeCategory = categories.find((c) => c.id === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {featuredOnly
              ? "Today's Deals"
              : activeCategory
                ? activeCategory.label
                : "All products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <form action="/shop" method="get" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search products..."
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:w-72"
          />
          {category && <input type="hidden" name="category" value={category} />}
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Search
          </button>
        </form>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500">No products found.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
