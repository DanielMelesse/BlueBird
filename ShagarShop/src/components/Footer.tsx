import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-bold text-zinc-900">
              Shagar<span className="text-brand-600">Shop</span>
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Your marketplace for quality products from trusted sellers.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="/shop" className="hover:text-brand-600">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-600">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="/login" className="hover:text-brand-600">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-brand-600">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Help</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="/sell" className="hover:text-brand-600">
                  Sell
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-brand-600">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/customer-service" className="hover:text-brand-600">
                  Customer Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-zinc-400" suppressHydrationWarning>
          © {new Date().getFullYear()} ShagarShop. Demo marketplace.
        </p>
      </div>
    </footer>
  );
}
