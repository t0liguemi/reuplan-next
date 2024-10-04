"use client";
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { addDays, daysToWeeks, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { type users, type event, type response, type invitation, responseRelations } from "~/server/db/schema";
import { findOverlappingTimes } from "~/lib/findOverlap";
import { Trash2 } from "lucide-react";
import { deleteResponse } from "~/server/actions";
import { toast } from "sonner";
import CalendarResults from "~/app/components/calendar";
import { atom } from "jotai";
import ResponseInput from "./responseForm";
import { useSession } from "next-auth/react";
import { Separator } from "~/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useTranslations } from "next-intl";

type ScheduleInResponses = { start: Date; end: Date };

export const notificationAtom = atom(false);

export default function Responses(props: {
  responses: UseQueryResult<(typeof response.$inferSelect)[], Error>;
  currentEvent: typeof event.$inferSelect;
  invitees: UseQueryResult<(typeof users.$inferSelect)[], Error>;
  invitations: UseQueryResult<(typeof invitation.$inferSelect)[], Error>;
}) {
  const t = useTranslations("EventPage");
  const queryClient = useQueryClient();
  const currentUser = useSession()?.data?.user;
  const { invitations, responses, currentEvent, invitees } = props;

  const parsedStart = new Date(currentEvent.from.setHours(0, 0, 0, 0));
  const parsedEnd = new Date(currentEvent.to.setHours(0, 0, 0, 0));

  async function handleDeleteResponse(id: string) {
    const deletedResponse = await deleteResponse(id);
    if (deletedResponse) {
      await queryClient.invalidateQueries({ queryKey: ["responses"] });
      await queryClient.invalidateQueries({ queryKey: ["userResponses"] });
      await queryClient.invalidateQueries({ queryKey: ["userInvitations"] });
      toast.success(t("responseDeletionSuccessToast"));
    } else{
      toast.error(t("responseDeletionErrorToast"));
    }
  }

  //generate all days between the start and end of the event, inclusive
  const availableDays: Date[] = [];
  availableDays.push(parsedStart);
  while ((availableDays.at(-1) ?? parsedStart) < parsedEnd) {
    availableDays.push(addDays(availableDays.at(-1) ?? parsedStart, 1));
  }

  const attendingPeople = new Set<string>();
  const overlappingTimes = new Map<string, ScheduleInResponses[]>();

  if (responses.data && invitations.data) {
    for (const response of responses.data) {
      if (
        invitations.data.some((inv) => response.invitee_id === inv.invitee_id)
      ) {
        attendingPeople.add(response.invitee_id);
      }
    }

    for (const day of availableDays) {
      const responsesForDay = responses.data?.filter(
        (response) => response.date?.getDate() === day.getDate() && response.date?.getMonth() === day.getMonth() && response.date?.getFullYear() === day.getFullYear(),
      );
      const overlappingTimesForDay: ScheduleInResponses[] =
        findOverlappingTimes(responsesForDay ?? [], attendingPeople.size);

      overlappingTimes.set(`${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`, overlappingTimesForDay);
    }

    if (responses.isLoading || invitations.isLoading || invitees.isLoading) {
      <div className="my-4">
        <h2>{t("responses")}</h2>
        <div className="my-4 flex flex-col flex-wrap justify-start gap-2 align-baseline">
          <h2 className="text-2xl font-light">{t("responses")}</h2>
          <Skeleton className="h-[24px] w-[512px]" />
          <Skeleton className="h-[24px] w-[512px]" />
          <Skeleton className="h-[24px] w-[512px]" />
          <Skeleton className="h-[24px] w-[512px]" />
        </div>
      </div>;
    }

    if (responses.data && invitations.data && invitees.data) {
      return (
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-3xl font-light">{t("surveyResults")}</h3>
          <div className="flex w-[90vw] flex-row justify-start gap-1 overflow-scroll">
            {availableDays.map((day) => (
              <CalendarResults
                key={"drawing" + day.toString()}
                start={day}
                schedules={overlappingTimes.get(`${day.getDate()}-${day.getMonth()}-${day.getFullYear()}` ) ?? []}
              />
            ))}
          </div>
          <p className="text-sm font-light text-muted-foreground">
            {t.rich("calendarExplanation", {strong: (chunks) => <span className="font-extrabold">{chunks}</span>})}
          </p>
          <p className="text-sm font-extrabold text-muted-foreground">
            {t("attendees")} ≠ {t("invitees")}
          </p>

          {/* <Select onValueChange={(e) => setSelectedDay(new Date(e))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableDays.map((day, i) => (
                  <SelectItem value={day.toString()} key={day.toString()}>
                    {format(day, "dd/MM/y")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <h2>Selected: {selectedDay?.toString()}</h2> */}
          {/* <div className="my-4 flex gap-2">
            {responses.data.length > 0 ? (
              <div className="flex flex-col gap-2">
                
                <h2 className="text-2xl font-light">Responses:</h2>
                {responses.data.map((response, index) =>
                  response.is_accepted &&
                  response.start_time &&
                  response.end_time &&
                  response.date &&
                  response.date?.getDate() === selectedDay?.getDate() ? (
                    <div
                      key={index}
                      className={`flex max-w-[90vw] flex-row items-center justify-between gap-2 rounded-sm bg-muted px-4 py-1 text-sm sm:gap-4 lg:gap-8`}
                    >
                      <p className="max-w-[20vw] overflow-hidden text-ellipsis sm:max-w-full">
                        {invitees.data.find(
                          (user) => user.id === response.invitee_id,
                        )?.nickname ??
                          invitees.data.find(
                            (user) => user.id === response.invitee_id,
                          )?.name}{" "}
                        (
                        {
                          invitees.data.find(
                            (user) => user.id === response.invitee_id,
                          )?.email
                        }
                        )
                      </p>
                      <p className="">{format(response.date, "dd/MM/y")}</p>
                      <div className="flex flex-row gap-2">
                        {format(response.start_time, "HH:mm")}
                        {" - "}
                        {format(response.end_time, "HH:mm")}
                        <button>
                          <Trash2
                            onClick={() => handleDeleteResponse(response.id)}
                            className="h-5 w-5 border-none bg-none text-destructive"
                          />
                        </button>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            ) : (
              <h2 key="noresponse" className="my-4 text-2xl font-light">
                Responses: No responses yet 😢😢
              </h2>
            )}
          </div> */}

          {/* {selectedDay && (
            <div>
              Responses overlap for {format(selectedDay, "dd/MM/y")}
              {overlappingTimes.get(selectedDay.getDate())?.map((result) => (
                <div key={result.start.toString()}>
                  {format(result.start, "HH:mm")} -{" "}
                  {format(result.end, "HH:mm")}
                </div>
              ))}
            </div>
          )} */}

          <Separator orientation="horizontal" className="my-4 w-full" />

          {(invitations.data.some(inv=>inv.invitee_id===currentUser?.id) || responses.data.some(resp=>resp.invitee_id===currentUser?.id)) && <h3 className="mb-4 text-3xl font-light">{t("yourResponses")}</h3>}

          <div className="my-4 flex flex-row gap-2 md:gap-4">
            {responses.data
              .filter((response) => response.invitee_id === currentUser?.id)
              .map((response) =>
                response.is_accepted && response.date && response.start_time && response.end_time ? (
                  <Popover key={response.id}>
                    <PopoverTrigger className="text-light rounded-md bg-muted px-2 py-2">
                      {format(response.date, "iii dd/MM")}
                    </PopoverTrigger>
                    <PopoverContent className="justify-bottom text-light flex w-fit flex-col items-center gap-2 rounded-md bg-muted/60 px-2 py-2 backdrop-blur-lg">
                      <p className="text-md font-light">
                        {format(response.date, "PPPP")}
                      </p>
                      <p className="text-md flex flex-row gap-2 font-light">
                        {format(response.start_time, "Pp")} -{" "}
                        {format(response.end_time, "Pp")}
                        <Trash2
                          onClick={() => handleDeleteResponse(response.id)}
                          className="h-5 w-5 border-none bg-none text-destructive"
                        />
                      </p>
                    </PopoverContent>
                  </Popover>
                ) : null,
              )}
          </div>

          {invitations.data.some(
            (invitation) => invitation.invitee_id === currentUser?.id,
          ) && <ResponseInput currentEvent={currentEvent} />}
        </div>
      );
    }
    if (responses.error ?? invitations.error ?? invitees.error) {
      return (
        <div className="my-4 text-2xl font-light">{t("genericErrorLoading")} {t("responses")}</div>
      );
    }
  }
}
