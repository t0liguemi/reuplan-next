"use client";
import { Link } from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { createAnonEvent } from "~/server/actions";
import { toast } from "sonner";

export default function MainActionButtons() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-4">
      <Link href="/events" className="my-2">
        <Button className="rounded-2xl px-8 py-6 text-2xl font-light">
          {t("myEvents")}
        </Button>
      </Link>
      <div className="overflow-clip rounded-2xl">
        <Link href="/events/create" className="my-2">
          <Button
            variant={"success"}
            className="rounded-none border-e-2 border-black border-opacity-20 py-6 ps-8 text-2xl font-light"
          >
            {t("newEvent")}
          </Button>
        </Link>
        <Link href="/events/anonymous" className="my-2">
          <Button
            variant={"success"}
            className="rounded-none py-6 pe-8 text-2xl font-light"
          >
            {t("anonEvent")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function LoggedOutMainButtons() {
  const handleCreateAnonEvent = async () => {
    const newAnonEvent = await createAnonEvent();
    if (newAnonEvent) {
      toast(newAnonEvent[0]?.code);
      console.log(newAnonEvent);
    } else {
      toast("Error creating anon event");
    }
  };
  const t = useTranslations("HomePage");
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-4">
      <Button
        className="rounded-2xl px-8 py-6 text-2xl font-light"
        onClick={() => signIn()}
      >
        {t("signIn")}
      </Button>

      <Button
        variant="success"
        className="rounded-2xl px-8 py-6 text-2xl font-light"
        onClick={() => handleCreateAnonEvent()}
      >
        {t("anonEvent")}
      </Button>
    </div>
  );
}
