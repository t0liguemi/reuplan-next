"use client";
import { Link } from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { createAnonEvent } from "~/server/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MainActionButtons() {
  const router = useRouter();
  const [mutating, setMutating] = useState(false);
  const handleCreateAnonEvent = async () => {
    if (mutating) return;
    setMutating(true);
    const newAnonEvent = await createAnonEvent();
    if (newAnonEvent) {
      toast(newAnonEvent[0]?.code);
      router.push(`/anonEvent/${newAnonEvent[0]?.code}`);
    } else {
      toast("Error creating anon event");
      setMutating(false)
    }
  };
  const t = useTranslations("HomePage");
  return (
    <div className="flex w-full max-md:flex-col flex-row items-center justify-center sm:gap-4">
      <Link href="/events" className="my-2">
        <Button className="rounded-2xl px-8 py-6 text-2xl font-light">
          {t("myEvents")}
        </Button>
      </Link>
      <div className="md:overflow-clip md:rounded-2xl max-md:flex max-md:flex-col max-md:gap-2 items-center">
        <Link href="/events/create" className="my-2">
          <Button
            variant={"success"}
            className="max-md:rounded-2xl md:rounded-none md:border-e-2 border-black border-opacity-20 py-6 md:ps-8 text-2xl font-light"
          >
            {t("newEvent")}
          </Button>
        </Link>

        <Button
          disabled={mutating}
          variant={"success"}
          className="max-md:rounded-2xl md:rounded-none py-6 md:pe-8 text-2xl font-light"
          onClick={() => handleCreateAnonEvent()}
        >
          {t("anonEvent")}
        </Button>
      </div>
    </div>
  );
}

export function LoggedOutMainButtons() {
  const router = useRouter();
  const [mutating, setMutating] = useState(false);
  const handleCreateAnonEvent = async () => {
    setMutating(true);
    const newAnonEvent = await createAnonEvent();
    if (newAnonEvent) {
      toast(newAnonEvent[0]?.code);
      router.push(`/anonEvent/${newAnonEvent[0]?.code}`);
    } else {
      toast("Error creating anon event");
    }
    setMutating(false);
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
        disabled={mutating}
        variant="success"
        className="rounded-2xl px-8 py-6 text-2xl font-light"
        onClick={() => handleCreateAnonEvent()}
      >
        {t("anonEvent")}
      </Button>
    </div>
  );
}
