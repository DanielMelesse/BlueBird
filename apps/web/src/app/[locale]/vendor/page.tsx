import { useTranslations } from "next-intl";

export default function VendorDashboardPage() {
  const t = useTranslations();

  return (
    <main style={{ padding: 16 }}>
      <h1>{t("vendor.title")}</h1>
      <p>{t("vendor.description")}</p>
    </main>
  );
}
