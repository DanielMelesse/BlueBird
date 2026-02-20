import { useTranslations } from "next-intl";

export default function AdminDashboardPage() {
  const t = useTranslations();

  return (
    <main style={{ padding: 16 }}>
      <h1>{t("admin.title")}</h1>
      <p>{t("admin.description")}</p>
    </main>
  );
}
