import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata = {
  title: "Customer Service — ShagarShop",
  description: "Get help with orders, returns, and your ShagarShop account.",
};

export default function CustomerServicePage() {
  return (
    <InfoPage
      title="Customer Service"
      subtitle="We're here to help with orders, returns, and your account."
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Contact us</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <span className="font-medium text-zinc-900">Email:</span>{" "}
            <a
              href="mailto:support@shagarshop.com"
              className="text-brand-600 hover:text-brand-700"
            >
              support@shagarshop.com
            </a>
          </li>
          <li>
            <span className="font-medium text-zinc-900">Phone:</span> +251 11 000
            0000
          </li>
          <li>
            <span className="font-medium text-zinc-900">Hours:</span> Mon–Sat,
            8:00–20:00 EAT
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Common topics</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Track or change an order</li>
          <li>Returns within our 5-day hassle-free policy</li>
          <li>Payment and refunds in Birr</li>
          <li>Account login and security</li>
        </ul>
      </div>
      <Link
        href="/login"
        className="inline-block rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
      >
        Log in to view orders
      </Link>
    </InfoPage>
  );
}
