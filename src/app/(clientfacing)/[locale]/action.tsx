"use client";
import { Link } from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";

export default function MainActionButtons(){
  const t = useTranslations("HomePage");
    return (
        <div className="flex gap-2 flex-wrap justify-center items-center sm:gap-4">
        <Link href="/events" className="my-2">
          <Button className="text-2xl px-8 py-6 font-light">{t("myEvents")}</Button>
        </Link>
        <Link href="/events/create" className="my-2">
          <Button variant={"success"} className="text-2xl px-8 py-6 font-light">{t("newEvent")}</Button>
        </Link>
        </div>
    )
}