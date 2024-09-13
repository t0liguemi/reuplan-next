import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as Locale)) notFound();

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    messages: (
      await(locale === "en"
      ? import("../messages/en.json")
      : import(`../messages/${locale}.json`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    )).default,
  };
});
