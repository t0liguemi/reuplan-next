import { Separator } from "~/components/ui/separator";
import ContactForm from "./contactForm";
import { auth } from "auth";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("ContactPage");
  const session = await auth();

  return (
    <div className="flex w-full flex-col items-center justify-start px-2 py-8 sm:px-4 md:px-8 lg:px-12">
      <h1 className="pb-2 text-3xl font-extrabold">{t("title")}</h1>
      <Separator orientation="horizontal" className="mb-4 w-full" />
      <p className="max-w-[1200px] text-md my-4 font-light text-muted-foreground">
        {t.rich("description", {
          br: () => <br/>,
        })}
      </p>
      <ContactForm name={session?.user?.name} email={session?.user?.email} />
    </div>
  );
}
