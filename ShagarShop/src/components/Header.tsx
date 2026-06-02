"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useMounted } from "@/hooks/useMounted";
import { HeaderSearch } from "@/components/HeaderSearch";

export function Header() {
  const mounted = useMounted();
  const { user, logout, isReady: authReady } = useAuth();
  const { itemCount, isReady: cartReady } = useCart();

  const showUser = mounted && authReady && user;
  const showCartBadge = mounted && cartReady && itemCount > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            S
          </span>
          <span className="text-lg text-zinc-900">
            Shagar<span className="text-brand-600">Shop</span>
          </span>
        </Link>

        <HeaderSearch />

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {showUser ? (
            <>
              <span className="hidden text-sm text-zinc-600 sm:inline">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
            >
              Log in
            </Link>
          )}

          <Link
            href="/cart"
            aria-label={
              showCartBadge
                ? `Cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`
                : "Cart"
            }
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700"
          >
            <CartIcon />
            {showCartBadge && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-xs font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
