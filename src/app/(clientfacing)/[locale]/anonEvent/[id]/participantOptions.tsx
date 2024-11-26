"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createAnonParticipant, getAnonParticipants } from "~/server/actions";
import ParticipantList from "./participantList";
import { atom, useSetAtom } from "jotai";
import { set } from "date-fns";
import { Skeleton } from "~/components/ui/skeleton";
import { useTranslations } from "next-intl";

export const currentParticipant = atom("");
export const storedParticipant = atom("");
export const currentParticipantID = atom("");

export default function ParticipantOptions({
  eventId,
  eventCode,
}: {
  eventId: string;
  eventCode: string;
}) {
  const t = useTranslations("AnonEventPage");
  const setCurrent = useSetAtom(currentParticipant);
  const setStored = useSetAtom(storedParticipant);

  const queryClient = useQueryClient();
  const participantsQuery = useQuery({
    queryKey: ["anonParticipants", eventCode],
    queryFn: () => getAnonParticipants(eventId),
  });

  async function handleCreateParticipant(participantName: string) {
    if (participantName.length < 6) {
      toast(t("newParticipantNameTooShort"));
      return;
    }
    if (participantName.length > 27) {
      toast(t("newParticipantNameTooLong"));
      return;
    }
    if (
      participantsQuery.data?.some(
        (participant) => participant.name === participantName,
      )
    ) {
      toast("Participant already exists!");
      return;
    }
    const newParticipant = await createAnonParticipant({
      anon_event_id: eventId,
      name: participantName,
    });
    if (newParticipant) {
      localStorage.setItem("anonParticipant", participantName);
      queryClient.invalidateQueries({
        queryKey: ["anonParticipants", eventCode],
      });
      setCurrent(participantName);
      setStored(participantName);
    } else {
      toast("Error creating participant");
    }
  }

  return (
    <div className="my-8">
      {participantsQuery.isLoading ? (
        <>
          <Skeleton
            aria-orientation="horizontal"
            className="my-4 h-[240px] w-full max-w-3xl"
          />
        </>
      ) : participantsQuery.data ? (
        participantsQuery.isError ? (
          <p className="text-center text-sm text-muted-foreground">
            {t("errorLoadingPaticipants")}
          </p>
        ) : (
          <div className="w-full max-w-3xl rounded-xl border-2 border-border p-4">
            <div className="flex flex-row justify-between items-center gap-4">
              <h3 className="text-light text-2xl">{t("participants")}</h3>
              <form
                className="my-4 flex max-w-[500px] flex-row gap-2"
                action={async (e) => {
                  await handleCreateParticipant(
                    e.get("participantName")?.toString() ?? "",
                  );
                  e.delete;
                }}
              >
                <Input name="participantName"></Input>
                <Button type="submit">{t("createParticipant")}</Button>
              </form>
            </div>
            <ParticipantList
              participants={participantsQuery.data}
              eventCode={eventCode}
              eventId={eventId}
            />
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
