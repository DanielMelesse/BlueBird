"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildShopSearchUrl,
  formatPrice,
  searchCategories,
  searchDepartments,
  searchProducts,
  type SearchDepartment,
} from "@/lib/products";
import type { Product } from "@/lib/types";

const MAX_PRODUCTS = 6;

type DropdownItem =
  | { type: "product"; product: Product }
  | { type: "category"; id: string; label: string }
  | { type: "see-all"; query: string };

export function HeaderSearch() {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<SearchDepartment>("all");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  const items = useMemo((): DropdownItem[] => {
    if (!debouncedQuery.trim()) return [];
    const matchedCategories = searchCategories(debouncedQuery, department);
    const productResults = searchProducts(debouncedQuery, MAX_PRODUCTS, department);
    return [
      ...matchedCategories.map(
        (c) => ({ type: "category", id: c.id, label: c.label }) as const,
      ),
      ...productResults.map((p) => ({ type: "product", product: p }) as const),
      { type: "see-all", query: debouncedQuery.trim() },
    ];
  }, [debouncedQuery, department]);

  const products = items.filter((i): i is { type: "product"; product: Product } => i.type === "product");
  const matchedCategories = items.filter(
    (i): i is { type: "category"; id: string; label: string } => i.type === "category",
  );
  const onlySeeAll = items.length === 1 && items[0].type === "see-all";

  const showDropdown = open && hasQuery;

  const goToShop = useCallback(
    (q?: string) => {
      const term = (q ?? query).trim();
      setOpen(false);
      setActiveIndex(-1);
      router.push(buildShopSearchUrl({ q: term, department }));
    },
    [query, department, router],
  );

  const selectItem = useCallback(
    (item: DropdownItem) => {
      if (item.type === "product") {
        setOpen(false);
        setQuery("");
        router.push(`/product/${item.product.id}`);
      } else if (item.type === "category") {
        setOpen(false);
        setQuery("");
        router.push(`/shop?category=${item.id}`);
      } else {
        goToShop(item.query);
      }
    },
    [goToShop, router],
  );

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (activeIndex >= 0 && items[activeIndex]) {
      selectItem(items[activeIndex]);
      return;
    }
    goToShop();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || items.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < items.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : items.length - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectItem(items[activeIndex]);
    }
  }

  function itemClass(active: boolean) {
    return active
      ? "bg-brand-50 text-brand-800"
      : "text-zinc-700 hover:bg-zinc-50";
  }

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1 sm:max-w-md lg:max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
        role="search"
      >
        <label htmlFor="search-department" className="sr-only">
          Search in department
        </label>
        <select
          id="search-department"
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value as SearchDepartment)}
          className="shrink-0 cursor-pointer border-0 border-r border-zinc-200 bg-zinc-50 py-2.5 pl-3 pr-8 text-sm font-medium text-zinc-800 outline-none focus:bg-zinc-100"
        >
          {searchDepartments.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <label htmlFor="header-search" className="sr-only">
          Search products
        </label>
        <input
          id="header-search"
          type="search"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => hasQuery && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search ShagarShop"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          className="w-full min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
        <button
          type="submit"
          className="shrink-0 bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full z-50 mt-1 max-h-[min(70vh,24rem)] w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-xl"
        >
          {onlySeeAll && (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">
              No matches for &ldquo;{trimmed}&rdquo;
            </p>
          )}

          {matchedCategories.length > 0 && (
            <div className="border-b border-zinc-100 px-2 py-2">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Categories
              </p>
              {items.map((item, idx) => {
                if (item.type !== "category") return null;
                const active = activeIndex === idx;
                return (
                  <button
                    key={`cat-${item.id}`}
                    id={`${listboxId}-option-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectItem(item)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${itemClass(active)}`}
                  >
                    in {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {products.length > 0 && (
            <div className="px-2 py-2">
              {matchedCategories.length > 0 && (
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Products
                </p>
              )}
              {items.map((item, idx) => {
                if (item.type !== "product") return null;
                const active = activeIndex === idx;
                return (
                  <button
                    key={item.product.id}
                    id={`${listboxId}-option-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectItem(item)}
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${
                      active ? "bg-brand-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={item.product.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {items.some((i) => i.type === "see-all") && (
            <>
              {!onlySeeAll && <div className="border-t border-zinc-100" />}
              {items.map((item, idx) => {
                if (item.type !== "see-all") return null;
                const active = activeIndex === idx;
                return (
                  <Link
                    key="see-all"
                    id={`${listboxId}-option-${idx}`}
                    href={buildShopSearchUrl({
                      q: item.query,
                      department,
                    })}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`block px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-brand-600 hover:bg-zinc-50"
                    }`}
                  >
                    See all results for &ldquo;{item.query}&rdquo;
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
