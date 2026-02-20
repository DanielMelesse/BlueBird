import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { defaultLocale, locales } from "@/lib/i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const activeLocale = hasLocale(locales, locale) ? locale : defaultLocale;

  return {
    locale: activeLocale,
    messages: (await import(`../../../messages/${activeLocale}/common.json`)).default
  };
});
