import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(
): Promise<Metadata> {
    const t = await getTranslations("CreateEventPage")      
  return {title: `Reuplan - ${t("title")}`};
  }

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            {children}
        </section>
    );
}