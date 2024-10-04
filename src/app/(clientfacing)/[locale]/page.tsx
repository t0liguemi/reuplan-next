
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import MainActionButtons from "./action";
import { auth } from "auth";
import { getCurrentUsersEvents, getCurrentUserResponses } from "~/server/actions";
import { queryClient } from "./layout";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
): Promise<Metadata> {
  const session = await auth();
  if(session){return {title: `Reuplan - ${session?.user?.nickname ?? session?.user?.name}`}
  }else {return {title: "Reuplan"}}
}

export default async function HomePage() {
  const session = await auth();
  const t = await getTranslations("HomePage")
  await queryClient.prefetchQuery({queryKey:["userEvents"], queryFn:() => getCurrentUsersEvents(session?.user?.id??"")})
  await queryClient.prefetchQuery({queryKey:["userResponses"], queryFn:() => getCurrentUserResponses(session?.user?.id??"")})




  return (
    <div className="sm:py-8 py-4 flex flex-col items-center justify-center gap-8 lg:px-12 md:px-8 px-4">
      <div className="flex md:flex-row flex-col  md:items-start md:justify-start items-center  gap-6">
        <div className="flex flex-col max-w-[640px] gap-4 items-start justify-start py-5 text-foreground">
            <div className="text-4xl">
              <span className="font-bold">{t("title1")}</span>
              <span className="font-extrabold text-primary">Reu</span>
              <span className="text-success font-extrabold">plan</span>
              <span className="font-bold">
                {t("title2")}
              </span>
            </div>
            <p className="font-normal text-muted-foreground text-2xl">
              {t("subtitle1")}
            </p>
            {session?.user &&
      <MainActionButtons />}
            <Separator className="w-full" />
            <p className="font-light text-muted-foreground text-xl">
              {t.rich("paragraph1", {
                small: (chunks) => <small className="font-light text-muted-foreground/60">{chunks}</small>
              })}
              <br/><br/>
              {t("paragraph2")}

            </p>
        </div>
        <Image
          src="/assets/Calendarios.svg"
          alt="Calendarios"
          width={300}
          height={500}
          className="align-middle svg-contrast"
        />
      </div>
     
    </div>
  );
}
