import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function MarketplaceHome() {
  const t = useTranslations();

  return (
    <main style={{ padding: 16, maxWidth: 840, margin: "0 auto" }}>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <ul>
        <li>
          <Link href="/search">{t("actions.search")}</Link>
        </li>
        <li>
          <Link href="/vendor">{t("actions.vendorDashboard")}</Link>
        </li>
        <li>
          <Link href="/admin">{t("actions.adminDashboard")}</Link>
        </li>
      </ul>
    </main>
  );
}
