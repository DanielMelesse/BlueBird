import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata = {
  title: "Services — ShagarShop",
  description:
    "Book spa, gym, hair salon, nail salon, and touring packages on ShagarShop.",
};

const services = [
  {
    name: "Spa",
    description:
      "Massages, facials, body treatments, and wellness packages at partner spas near you.",
  },
  {
    name: "Gym",
    description:
      "Day passes, monthly memberships, personal training, and group fitness classes.",
  },
  {
    name: "Hair salon",
    description:
      "Cuts, color, styling, and treatments from vetted salons — book your slot online.",
  },
  {
    name: "Nail salon",
    description:
      "Manicures, pedicures, gel, and nail art with transparent pricing in Birr.",
  },
  {
    name: "Touring package",
    description:
      "Curated local and regional tours — transport, guides, and itineraries included.",
  },
];

export default function ServicePage() {
  return (
    <InfoPage
      title="Services"
      subtitle="Book wellness, beauty, fitness, and travel experiences in one place."
    >
      <p>
        ShagarShop Services lets you discover and book trusted providers. Choose a
        category below to browse offers and availability.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <li
            key={service.name}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-zinc-900">{service.name}</h2>
            <p className="mt-2 text-sm text-zinc-600">{service.description}</p>
            <p className="mt-4 text-sm font-medium text-brand-600">Coming soon</p>
          </li>
        ))}
      </ul>

      <p className="text-sm text-zinc-500">
        Want your business listed?{" "}
        <Link href="/sell" className="font-medium text-brand-600 hover:text-brand-700">
          Sell on ShagarShop
        </Link>{" "}
        or email{" "}
        <a
          href="mailto:services@shagarshop.com"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          services@shagarshop.com
        </a>
        .
      </p>
    </InfoPage>
  );
}
