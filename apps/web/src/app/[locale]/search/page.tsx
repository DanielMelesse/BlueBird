import { useTranslations } from "next-intl";

export default function SearchPage() {
  const t = useTranslations();

  return (
    <main style={{ padding: 16 }}>
      <h1>{t("search.title")}</h1>
      <p>{t("search.description")}</p>
    </main>
  );
}
