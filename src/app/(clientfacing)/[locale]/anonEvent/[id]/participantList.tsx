import { useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { deleteAnonParticipant } from "~/server/actions";
import { anon_participant } from "~/server/db/schema";
import { currentParticipant as currentAtom } from "./participantOptions";
import { storedParticipant as storedAtom } from "./participantOptions";
import { currentParticipantID as currentParticipantIDAtom } from "./participantOptions";
import { atom, useAtom, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

export default function ParticipantList({
  eventCode,
  participants,
  eventId,
}: {
  eventCode: string;
  participants: (typeof anon_participant.$inferSelect)[];
  eventId: string;
}) {
  const queryClient = useQueryClient();
  const t = useTranslations("AnonEventPage");

  const [currentParticipant, setCurrentParticipant] = useAtom(currentAtom);
  const [storedParticipant, setStoredParticipant] = useAtom(storedAtom);
  const setCurrentParticipantID = useSetAtom(currentParticipantIDAtom);

  async function handleDeleteAnonParticipant(participantId: string) {
    const deletedParticipant = await deleteAnonParticipant(participantId);
    if (deletedParticipant) {
      toast("Participant deleted");
      await queryClient.invalidateQueries({
        queryKey: ["anonParticipants", eventCode],
      });
      await queryClient.invalidateQueries({
        queryKey: [eventId, "anonEventSchedules"],
      });
      setCurrentParticipant("");
      localStorage.removeItem("anonParticipant");
    } else {
      toast("Error deleting participant");
    }
  }

  useEffect(() => {
    const totalParticipants = participants.length;
    let counter = 0
    for (const participant of participants) {
      if (participant.name === localStorage.getItem("anonParticipant"))
       {
        setCurrentParticipant(localStorage.getItem("anonParticipant") ?? "");
        setStoredParticipant(participant.name);
        setCurrentParticipantID(participant.id);
        toast("Participating as " + localStorage.getItem("anonParticipant"));
        localStorage.setItem("anonParticipantId", participant.id ?? "");
        break;
      } else {
        counter++
        if (counter === totalParticipants) {
          toast("Enter your name to participate!");
        }
      }
    }
  }, [participants,storedParticipant]);

  return (
    <>
      {participants.length > 0 && (
        <div className="flex flex-col w-full max-w-3xl">
          {participants?.map((participant) => (
            <div
              className={cn(
                "flex flex-row border-t border-border justify-between items-baseline gap-2 p-2",
                participant.name === currentParticipant
                  ? "bg-foreground/10 font-bold"
                  : "",
              )}
              key={participant.id}
            >
              <p>{participant.name}</p>
              <div className="flex flex-row items-center gap-2">
              <Button
                variant="success"
                className={cn(
                  participant.name === localStorage.getItem("anonParticipant")
                    ? "hidden"
                    : "",
                )}
                onClick={() => {
                  localStorage.setItem("anonParticipant", participant.name);
                  setStoredParticipant(participant.name);
                  setCurrentParticipant(participant.name);
                  setCurrentParticipantID(participant.id);
                  toast("Participating as " + participant.name);
                }}
              >
               {t("select")}
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => handleDeleteAnonParticipant(participant.id)}
              >
                {t("delete")}
              </Button></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
