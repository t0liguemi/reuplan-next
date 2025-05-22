"use client";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/i18n/routing";
import { deleteExpiredEvents } from "~/server/actions";

export default function DeleteExpiredEventsButton() {
  const router = useRouter();
  async function deleteExpired() {
    const res = await deleteExpiredEvents();
    if (res) {
        router.refresh()
    }
}

  return (
    <Button variant={"destructive"} onClick={deleteExpired}>
      Delete expired events DESTRUCTIVE
    </Button>
  );
}
