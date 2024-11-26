import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import MainActionButtons, { LoggedOutMainButtons } from "./action";
import { auth, signIn } from "auth";
import {
  getCurrentUsersEvents,
  getCurrentUserResponses,
} from "~/server/actions";
import { queryClient } from "./layout";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import EventSearchBar from "./eventSearch";

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
    <div className="flex flex-col items-center justify-center gap-4 py-4 px-2 sm:py-8 md:px-8 lg:px-12">
      <div className="flex flex-col items-center gap-6">
        <div className="flex max-w-[900px] flex-col items-start justify-center gap-4 text-foreground my-16 md:mt-20 md:mb-40"> 
          <div className="text-center text-5xl">
            <span className="font-extrabold">{t("title1")}</span>
            <span className="font-extrabold text-primary">Reu</span>
            <span className="font-extrabold text-success">plan</span>
            <span className="font-extrabold">{t("title2")}</span>
          </div>
          <p className="my-4 text-center">{t("subtitle1")}</p>
          {session?.user ? <MainActionButtons /> : <LoggedOutMainButtons />}
          <EventSearchBar />

          </div>
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <p className="text-muted-foreground">
              {t.rich("paragraph1", {
                small: (chunks) => (
                  <small className="font-light text-muted-foreground/60">
                    {chunks}
                  </small>
                ),
                donate: (chunks) => (
                  <a
                    className="font-bold text-primary underline"
                    href="https://www.paypal.com/donate/?business=KLME7PL6858QG&no_recurring=0&item_name=Support+Reuplan%21&currency_code=USD"
                  >
                    {chunks}
                  </a>
                ),
              })}
              <br />
              <br />
              {t.rich("paragraph2", {
                login: (chunks) => (
                  <button
                    type="submit"
                    className="font-bold text-primary underline"
                  >
                    {chunks}
                  </button>
                ),
              })}
            </p>
          </form>
        
        {/* <Image
          src="/assets/Calendarios.svg"
          alt="Calendarios"
          width={300}
          height={500}
          className="svg-contrast align-middle"
        /> */}
      </div>
      <Separator className="max-w-[964px]" />
      <div className="flex max-w-[964px] flex-col items-center justify-center gap-2 py-3 text-muted-foreground">
        <div className="rounded-md border-2 bg-background/60 p-2 text-foreground">
          <h3 className="my-2 text-2xl font-bold">{t("title3")}</h3>
          <p className="my-2">{t("paragraph3")}</p>
        </div>
        <p className="my-6">{t("paragraph4")}</p>
      </div>
    </div>
  );
}
