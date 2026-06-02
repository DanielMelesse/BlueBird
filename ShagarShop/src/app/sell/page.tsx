import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata = {
  title: "Sell on ShagarShop",
  description: "List your products and reach buyers on ShagarShop.",
};

export default function SellPage() {
  return (
    <InfoPage
      title="Sell on ShagarShop"
      subtitle="Open your shop and reach customers across the marketplace."
    >
      <p>
        ShagarShop makes it easy for individuals and businesses to list products,
        manage inventory, and fulfill orders from one place.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Create a seller account and verify your profile</li>
        <li>Upload product photos, descriptions, and pricing in Birr</li>
        <li>Track orders and payouts from your seller dashboard</li>
        <li>Get discovered through search, categories, and Today&apos;s Deals</li>
      </ul>
      <p>
        Seller onboarding is coming soon. For early access, contact us at{" "}
        <a
          href="mailto:sellers@shagarshop.com"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          sellers@shagarshop.com
        </a>
        .
      </p>
      <Link
        href="/signup"
        className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Create account to get started
      </Link>
    </InfoPage>
  );
}
