import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales } from "@/lib/i18n/config";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale
});
