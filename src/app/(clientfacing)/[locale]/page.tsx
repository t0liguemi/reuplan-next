import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import MainActionButtons from "./action";
import { auth } from "auth";
import {
  getCurrentUsersEvents,
  getCurrentUserResponses,
} from "~/server/actions";
import { queryClient } from "./layout";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  if (session) {
    return {
      title: `Reuplan - ${session?.user?.nickname ?? session?.user?.name}`,
    };
  } else {
    return { title: "Reuplan" };
  }
}

export default async function HomePage() {
  const session = await auth();
  const t = await getTranslations("HomePage");
  await queryClient.prefetchQuery({
    queryKey: ["userEvents"],
    queryFn: () => getCurrentUsersEvents(session?.user?.id ?? ""),
  });
  await queryClient.prefetchQuery({
    queryKey: ["userResponses"],
    queryFn: () => getCurrentUserResponses(session?.user?.id ?? ""),
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-4 sm:py-8 md:px-8 lg:px-12">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-start">
        <div className="flex max-w-[640px] flex-col items-start justify-start gap-4 py-5 text-foreground">
          <div className="text-4xl">
            <span className="font-extrabold">{t("title1")}</span>
            <span className="font-extrabold text-primary">Reu</span>
            <span className="font-extrabold text-success">plan</span>
            <span className="font-extrabold">{t("title2")}</span>
          </div>
          <p className="text-2xl font-bold text-muted-foreground">
            {t("subtitle1")}
          </p>
          {session?.user && <MainActionButtons />}
          <Separator className="w-full" />
          <p className="text-muted-foreground">
            {t.rich("paragraph1", {
              small: (chunks) => (
                <small className="font-light text-muted-foreground/60">
                  {chunks}
                </small>
              ),
              donate: (chunks) => (
                <a
                  className="text-primary underline font-bold"
                  href="https://www.paypal.com/donate/?business=KLME7PL6858QG&no_recurring=0&item_name=Support+Reuplan%21&currency_code=USD"
                >
                  {chunks}
                </a>
              ),
            })}
            <br />
            <br />
            {t("paragraph2")}
          </p>
        </div>
        <Image
          src="/assets/Calendarios.svg"
          alt="Calendarios"
          width={300}
          height={500}
          className="svg-contrast align-middle"
        />
      </div>
      <Separator className="max-w-[964px]" />
      <div className="flex-col flex gap-2 items-center justify-center max-w-[964px] py-3 text-muted-foreground">
        <h3 className="my-2 text-2xl font-bold">{t("title3")}</h3>
        <p className="my-2">{t("paragraph3")}</p>
        <p className="my-6 rounded-md border-2 bg-background/60 p-2 text-foreground">{t("paragraph4")}</p>
      </div>
    </div>
  );
}
