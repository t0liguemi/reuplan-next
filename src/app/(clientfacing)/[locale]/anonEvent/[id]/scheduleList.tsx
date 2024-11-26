"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { deleteAnonResponse, getAnonResponses } from "~/server/actions";
import { currentParticipantID as currentAtom } from "./participantOptions";
import { findAnonOverlap } from "~/lib/findAnonOverlap";
import CalendarResults from "~/app/components/calendar";
import { useTranslations } from "next-intl";
import { Skeleton } from "~/components/ui/skeleton";
import ScheduleInput from "./scheduleInput";

type ScheduleInResponses = { start: Date; end: Date };

export default function ScheduleList({
  eventId,
  eventFrom,
  eventTo,
}: {
  eventId: string;
  eventFrom: Date;
  eventTo: Date;
}) {
  const currentParticipantID = useAtomValue(currentAtom);
  const queryClient = useQueryClient();
  const schedulesQuery = useQuery({
    queryKey: [eventId, "anonEventSchedules"],
    queryFn: () => getAnonResponses(eventId),
  });

  const t = useTranslations("AnonEventPage");

  async function handleDeleteAnonResponse(responseId: string) {
    const deletedResponse = await deleteAnonResponse(responseId);
    if (deletedResponse) {
      toast("Response deleted");
      await queryClient.invalidateQueries({
        queryKey: [eventId, "anonEventSchedules"],
      });
    } else {
      toast("Error deleting response");
    }
  }

  if (schedulesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton aria-orientation="horizontal" className="h-[640px] w-full" />
        <Skeleton
          aria-orientation="horizontal"
          className="h-[240px] w-full max-w-3xl"
        />
      </div>
    );
  }
  if (schedulesQuery.isError) {
    return <p>Error loading schedules</p>;
  }
  if (schedulesQuery.data) {
    const differentUsers = new Set<string>();
    schedulesQuery.data.forEach((schedule) => {
      differentUsers.add(schedule.participant_id);
    });

    const overlappingTimes = new Map<string, ScheduleInResponses[]>();

    const availableDays: Date[] = [];
    const parsedStart = new Date(eventFrom.setHours(0, 0, 0, 0));
    const parsedEnd = new Date(eventTo.setHours(0, 0, 0, 0));

    availableDays.push(parsedStart);
    while ((availableDays.at(-1) ?? parsedStart) < parsedEnd) {
      availableDays.push(addDays(availableDays.at(-1) ?? parsedStart, 1));
    }

    for (const day of availableDays) {
      const responsesForDay = schedulesQuery.data?.filter(
        (response) =>
          response.date?.getDate() === day.getDate() &&
          response.date?.getMonth() === day.getMonth() &&
          response.date?.getFullYear() === day.getFullYear(),
      );
      const overlappingTimesForDay: ScheduleInResponses[] = findAnonOverlap(
        responsesForDay ?? [],
        differentUsers.size,
      );

      overlappingTimes.set(
        `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`,
        overlappingTimesForDay,
      );
    }

    console.log(overlappingTimes);

    return (
      <div>
        <div className="my-6 flex flex-col items-center gap-4">
          <h3 className="text-3xl font-light">{t("surveyResults")}</h3>
          <div className="flex w-[90vw] flex-row justify-start gap-1 overflow-scroll">
            {availableDays.map((day) => (
              <CalendarResults
                key={day.toString()}
                start={day}
                schedules={
                  overlappingTimes.get(
                    `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`,
                  ) ?? []
                }
              />
            ))}
          </div>
        </div>
        {currentParticipantID ? (
          <div className="border-boder my-4 w-full max-w-3xl rounded-xl border-2 p-4">
            <div className="flex flex-row flex-wrap items-center gap-2">
              <h3 className="my-2 text-2xl font-light">
                {t("currentParticipantSchedules")}
              </h3>
              <ScheduleInput
                code={eventId}
                eventFrom={eventFrom}
                eventTo={eventTo}
              />
            </div>
            <div className="my-4 flex w-full flex-col gap-1">
              {schedulesQuery.data.filter(
                (sch) => sch.participant_id === currentParticipantID,
              ).length === 0 && (
                <p className="my-2 text-muted-foreground/70">
                  {t("noSchedulesParticipant")}
                </p>
              )}
              {schedulesQuery.data
                .filter((sch) => sch.participant_id === currentParticipantID)
                .map((sch) => {
                  return (
                    <div
                      key={sch.id}
                      className="flex flex-row items-center justify-between px-2 text-sm"
                    >
                      <p>
                        {format(sch.start_time, "Pp") +
                          "-" +
                          format(sch.end_time, "Pp")}
                      </p>
                      <Button
                        variant={"destructive"}
                        onClick={() => handleDeleteAnonResponse(sch.id)}
                        className="h-min px-1 py-1 text-sm"
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="border-boder my-4 w-full max-w-3xl rounded-xl border-2 p-4">
                         <h3 className="my-2 text-2xl font-light">
                {t("currentParticipantSchedules")}
              </h3><p>No participant selected</p> 
          </div>
        )}
      </div>
    );
  }
}
