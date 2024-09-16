"use client";
import type { users, event as eventType } from "~/server/db/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import MapsDrawer from "./(eventComponents)/mapsDrawer";
import InviteesList from "./(eventComponents)/inviteesList";
import {
  deleteRejection,
  getInvitations,
  getInviteesProfiles,
  getResponses,
  rejectEvent,
} from "~/server/actions";
import Responses from "./(eventComponents)/responses";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import EditEventSheet from "./(eventComponents)/editEvent";
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import InvitationForm from "./(eventComponents)/invitationForm";
import { useTranslations } from "next-intl";
import { format, setDefaultOptions } from "date-fns";
import { es,enGB,de } from 'date-fns/locale'
import { useLocale } from "next-intl";



export default function MainEventView(props: {
  event: typeof eventType.$inferSelect;
  organizer: typeof users.$inferSelect;
}) {
  const currentLocale = useLocale();
  setDefaultOptions({ locale: currentLocale==="es" ? es : currentLocale==="en" ? enGB : de })
  const router = useRouter();
  const { event, organizer } = props;
  const currentUser = useSession()?.data?.user;
  const t = useTranslations("EventPage");
  const queryClient = useQueryClient();

  const eventData = useQueries({
    queries: [
      {
        queryKey: ["responses", event.id],
        queryFn: () => getResponses(event.id),
      },

      {
        queryKey: ["invitations", event.id],
        queryFn: () => getInvitations(event.id),
      },
      {
        queryKey: ["invitees", event.id],
        queryFn: () => getInviteesProfiles(event.id),
      },
    ],
  });

  async function callToActionResponse() {
    if (
      eventData[0].data?.some(
        (resp) => !resp.is_accepted && resp.invitee_id === currentUser?.id,
      )
    ) {
      const rejected = await deleteRejection(event.id, currentUser?.id ?? "");
      if (rejected) {
        toast(
          t("rejectionDeleted")
        );
        await queryClient.invalidateQueries({
          queryKey: ["responses", event.id],
        });
        await queryClient.invalidateQueries({
          queryKey: ["userResponses", currentUser?.id],
        });
      } else {
        toast(t("errorDeletingRejection"));
      }
    } else {
      toast(
        t("callToActionResponseToast")
      );
    }
    router.push("#enter-response");
    window.document
      .getElementById("enter-response")
      ?.classList.remove("call-to-action-glow");
    void window.document.getElementById("enter-response")?.offsetWidth;
    window.document
      .getElementById("enter-response")
      ?.classList.add("call-to-action-glow");
  }

  async function callToActionParticipate() {
    if (eventData[1].data?.some((inv) => inv.invitee_id === currentUser?.id)) {
      await callToActionResponse();
    } else {
      toast(t("calltoActionParticipateToast"));
      window.document
        .getElementById("invite-button")
        ?.classList.remove("call-to-action-glow");
      void window.document.getElementById("invite-button")?.offsetWidth;
      window.document
        .getElementById("invite-button")
        ?.classList.add("call-to-action-glow");
    }
  }

  async function handleRejection() {
    const rejectedEvent = await rejectEvent(event.id, currentUser?.id ?? "");
    if (rejectedEvent != false) {
      await queryClient.invalidateQueries({
        queryKey: ["responses", event.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["userResponses", currentUser?.id],
      });
    } else {
      toast(t("rejectionError"));
    }
  }

  const wasRejected = React.useMemo(() => {
    if (
      eventData[0].data?.some(
        (resp) => !resp.is_accepted && resp.invitee_id === currentUser?.id,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }, [eventData, currentUser]);

  const queriesLoaded = React.useMemo(() => {
    return eventData[0].data && eventData[1].data && eventData[2].data;
  }, [eventData]);

  React.useEffect(() => {
    if (wasRejected && queriesLoaded) {
      toast(
        t("rejectionToast")
      );
      window.document
        .getElementById("accept-button")
        ?.classList.remove("call-to-action-glow");
      void window.document.getElementById("accept-button")?.offsetWidth;
      window.document
        .getElementById("accept-button")
        ?.classList.add("call-to-action-glow");
    }
  }, [wasRejected, queriesLoaded]);

  if (eventData[0].isLoading || eventData[2].isLoading) {
    return (
      <div>
        {" "}
        <div className="flex flex-col justify-start sm:flex-row sm:items-end sm:gap-2">
          <Skeleton className="h-[80px] w-[60vw]" />
        </div>
        <Separator orientation="horizontal" className="my-4 w-full sm:my-8" />
        <div className="my-4 flex flex-col justify-start gap-4 align-baseline">
          <Skeleton className="h-[40px] w-[60vw]" />
          <Skeleton className="h-[40px] w-[80vw]" />
          <Skeleton className="h-[40px] w-[80vw]" />
          <div className="align-center my-4 flex flex-row flex-wrap justify-start gap-2">
            <Skeleton className="h-[40px] w-[128px]" />
            <Skeleton className="h-[40px] w-[148px]" />
            <Skeleton className="h-[40px] w-[96px]" />
            <Skeleton className="h-[40px] w-[112px]" />
            <Skeleton className="h-[40px] w-[128px]" />
            <Skeleton className="h-[40px] w-[96px]" />
            <Skeleton className="h-[40px] w-[148px]" />
            <Skeleton className="h-[40px] w-[88px]" />
          </div>
          <Skeleton className="h-[30vh] w-[80vw]" />
          <Skeleton className="h-[40px] w-[60vw]" />
        </div>
      </div>
    );
  }

  if (eventData[0].error ?? eventData[1].error ?? eventData[2].error) {
    return (
      <div className="my-4 text-2xl font-light">{t("genericErrorLoading")}</div>
    );
  }

  if (
    !eventData[1].data?.some((inv) => inv.invitee_id === currentUser?.id) &&
    event.host_id !== currentUser?.id
  ) {
    toast(t("notInvitedToast"));
    router.push("/events");
  } else if (
    currentUser &&
    eventData[0].data &&
    eventData[1].data &&
    eventData[2].data
  ) {
    return (
      <div>
        <div className="flex flex-row items-end justify-between gap-1">
          <div className="flex flex-col justify-start sm:flex-row sm:items-end sm:gap-2">
            <p className="text-xl font-light sm:text-2xl md:text-3xl lg:text-4xl">
                {t("title")}:{" "}
            </p>
            <h1 className="text-wrap text-start text-5xl font-bold">
              {event.name}
            </h1>
            {event.host_id === currentUser.id && (
              <Badge variant={"outline"} className="w-fit border-primary my-2">
                {t("hostBadge")}
              </Badge>
            )}
            {wasRejected && (
              <Badge variant="outline" className="w-fit border-destructive my-2">
                {t("declinedBadge")}
              </Badge>
            )}
            {!wasRejected &&
              !eventData[0].data?.some(
                (res) => res.invitee_id === currentUser?.id,
              ) &&
              eventData[1].data?.some(
                (inv) => inv.invitee_id === currentUser?.id,
              ) && (
                <Badge variant="outline" className="w-fit border-destructive my-2">
                  {t("pending")}
                </Badge>
              )}
          </div>
          <div className="mb-[0.4rem] flex min-h-max flex-col-reverse justify-between gap-2 sm:flex-row">
            {currentUser.id === event.host_id && (
              <EditEventSheet event={event} />
            )}
            {event.host_id != currentUser?.id ? (
              <Link href={`/events/${event.id}#enter-response`}>
                <Button
                  id="accept-button"
                  className="text-md px-2 py-2 font-light sm:px-4 sm:text-xl"
                  variant="success"
                  onClick={() => callToActionResponse()}
                >
                  {t("accept")}
                </Button>
              </Link>
            ) : (
              <Button
                className="text-md px-2 py-2 font-light sm:px-4 sm:text-xl"
                variant="success"
                onClick={() => callToActionParticipate()}
              >
                {t("participate")}
              </Button>
            )}
            {event.host_id != currentUser?.id &&
            eventData[0].data?.some(
              (resp) =>
                !resp.is_accepted && resp.invitee_id === currentUser?.id,
            ) ? (
              <Button
                variant={"destructive"}
                className="text-md px-2 py-2 font-light outline-2 outline-destructive-foreground sm:px-4 sm:text-xl"
                disabled
              >
                {t("declined")}
              </Button>
            ) : (
              event.host_id != currentUser?.id && (
                <Button
                  variant={"destructive"}
                  className="text-md px-2 py-2 font-light sm:px-4 sm:text-xl"
                  onClick={() => handleRejection()}
                >
                  {t("decline")}
                </Button>
              )
            )}
          </div>
        </div>

        <Separator orientation="horizontal" className="my-4 w-full sm:my-8" />

        <div className="my-2 flex flex-row items-baseline text-2xl">
          <p className="font-light">{t("host")}: </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mx-2 bg-muted px-1 text-2xl font-bold hover:bg-muted/40"
              >
                {organizer.nickname ?? organizer.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-muted/40 backdrop-blur-lg">
              <div className="flex flex-col text-lg font-normal">
                <p>{organizer.name}</p>
                <p>{organizer.email}</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <p className="my-4 text-2xl font-light" id="event-date">
          {t("from")}{" "}
          <span className="font-bold">
            {format(event.from,"PPPP")}
          </span>{" "}
          {t("to")}{" "}
          <span className="font-bold">
            {format(event.to,"PPPP")} 
          </span>
        </p>

        <div id="event-location" className="my-4">
          {event.location && !event.maps_query && (
            <p className="my-2 text-2xl font-light">
              {t("location")}:{" "}
              <span className="font-bold">{event.location}</span>
            </p>
          )}
          {event.location && event.maps_query && (
            <div className="my-2 flex max-w-full flex-col gap-2 text-2xl sm:flex-row sm:items-baseline">
              <h2 className="text-2xl font-light">{t("location")}:</h2>
              <MapsDrawer location={event.location} />
            </div>
          )}
        </div>

        {event.privacy_level === 1 ? (
          <div>
            <p className="text-2xl font-light">
            {t("sentInvitations",{count: eventData[1].data?.length})}
            </p>
            {currentUser?.id === event.host_id && (
              <InvitationForm eventId={event.id} event={event} />
            )}
          </div>
        ) : event.privacy_level === 0 && currentUser?.id === event.host_id ? (
          <InviteesList
            invitations={eventData[1]}
            eventId={event.id}
            invitees={eventData[2]}
            event={event}
            responses={eventData[0]}
          />
        ) : (
          <InviteesList
            invitations={eventData[1]}
            eventId={event.id}
            invitees={eventData[2]}
            event={event}
            responses={eventData[0]}
          />
        )}

        <Separator orientation="horizontal" className="my-4 w-full sm:my-8" />
        {event.description ? (
          <div className="flex flex-row justify-center">
            <p className="text-md my-6 max-h-[40vh] max-w-[90vw] overflow-y-scroll rounded-lg border-foreground bg-muted/50 px-2 py-2 font-normal">
              {event.description}
            </p>
          </div>
        ) : null}

        <Responses
          responses={eventData[0]}
          currentEvent={event}
          invitees={eventData[2]}
          invitations={eventData[1]}
        />
      </div>
    );
  }
}
