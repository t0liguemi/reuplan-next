"use client";
import { eq } from "drizzle-orm";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useRouter } from "~/i18n/routing";
import { getAnonEvent } from "~/server/actions";
import { db } from "~/server/db";

export default function EventSearchBar() {
  const t = useTranslations("HomePage");
  const codeRegex = /^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/
  const router = useRouter();
  return (
    <div className="grid w-full justify-center">
      <form
        action={async (e) => {
          if (codeRegex.test(e.get("search")?.toString()??"")) {
            const foundEvent = await getAnonEvent(e.get("search")?.toString()??"")
            if (foundEvent) {router.push(`/anonEvent/${foundEvent.code}`)}
            else {toast(t("anonNotFound"))}
          }else{toast(t("invalidCode"))}
        }}
        className="flex min-w-[300px] max-w-[600px] flex-row justify-self-center overflow-clip rounded-3xl border-2 border-border bg-background px-1 py-1"
      >
        <Input
        id="search"
          name="search"
          className="border-none uppercase focus:border-none focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
          placeholder={"AAAA-BBBB"}
        ></Input>
        
        <Button type="submit" className="m-0 rounded-3xl">
          {t("searchAnonEvent")}
        </Button>
      </form>
      <Label htmlFor="search" className="mx-2 my-1 text-muted-foreground font-light">{t("seachAnonEventTooltip")}</Label> 
    </div>
  );
}
