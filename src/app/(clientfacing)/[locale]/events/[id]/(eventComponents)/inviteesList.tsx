"use client";

import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { deleteInvitation, getUser } from "~/server/actions";
import type { users, event, invitation, response } from "~/server/db/schema";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import InvitationForm from "./invitationForm";
import { useSession } from "next-auth/react";
import { PopoverClose } from "@radix-ui/react-popover";
import React from "react";
import { Badge } from "~/components/ui/badge";
import { useTranslations } from "next-intl";

export default function InviteesList(props: {
  invitations: UseQueryResult<(typeof invitation.$inferSelect)[], Error>;
  eventId: string;
  event: typeof event.$inferSelect;
  invitees: UseQueryResult<(typeof users.$inferSelect)[], Error>;
  responses: UseQueryResult<(typeof response.$inferSelect)[], Error>;
}) {
  const queryClient = useQueryClient();
  const t = useTranslations("EventPage");
  const { invitations, eventId, event, invitees, responses } = props;
  const currentUser = useSession()?.data?.user;

  const isInvited = React.useMemo(() => {
    if (!invitations.data?.some((inv) => inv.invitee_id === currentUser?.id)) {
      return false;
    } else {
      return true;
    }
  }, [invitations.data, currentUser]);

  React.useEffect(() => {
    if (!isInvited && event.host_id !== currentUser?.id) {
      toast(t("notInvitedToast"));
    }
    if (invitations.data?.length === 0) {
      toast(t("noInviteesEffectToast"));
    }
  }, [isInvited, invitations.data, currentUser, event]);

  async function handleDeleteInvitation(eventId: string, invitationId: string) {
    const deletedInvitation = await deleteInvitation(eventId, invitationId);
    if (deletedInvitation) {
      const deletedUser = await getUser(deletedInvitation);
      if (deletedUser) {
        toast.success(
          t("uninviteSuccessToast1")+ deletedUser?.nickname ?? deletedUser?.name ?? "" +t("uninviteSuccessToast2")
        );
      }
      await queryClient.invalidateQueries({ queryKey: ["invitees"] });
      await queryClient.invalidateQueries({ queryKey: ["responses"] });
      await queryClient.invalidateQueries({ queryKey: ["invitations"] });
      await queryClient.invalidateQueries({ queryKey: ["userEvents"] });
      await queryClient.invalidateQueries({ queryKey: ["userResponses"] });
      await queryClient.invalidateQueries({ queryKey: ["userInvitations"] });
    } else {
      toast.error(t("uninviteErrorToast"));
    }
  }

  if (invitations.error ?? invitees.error) {
    return (
      <div className="my-4 text-2xl font-light">{t("invitees")}:{t("genericErrorLoading")}</div>
    );
  }
  if (invitations.isLoading || invitees.isLoading) {
    return (
      <div className="align-center flex flex-row flex-wrap justify-start gap-2">
        <h2 className="text-2xl font-light">{t("invitees")}:</h2>
        <Skeleton className="h-[40px] w-[128px]" />
        <Skeleton className="h-[40px] w-[148px]" />
        <Skeleton className="h-[40px] w-[96px]" />
        <Skeleton className="h-[40px] w-[112px]" />
        <Skeleton className="h-[40px] w-[128px]" />
        <Skeleton className="h-[40px] w-[96px]" />
        <Skeleton className="h-[40px] w-[148px]" />
        <Skeleton className="h-[40px] w-[88px]" />
        {currentUser?.id === event.host_id && (
          <InvitationForm eventId={eventId} event={event} />
        )}
      </div>
    );
  }
  if (invitations.data && invitees.data && currentUser) {
    return (
      <div className="flex flex-col items-start gap-2 sm:flex-row justify-start">
        
          {((event.privacy_level > 0 || currentUser.id === event.host_id) && invitations.data.length > 0  ) ? (
            <div className="flex flex-row flex-wrap items-baseline gap-1 sm:gap-2">
              <h2 className="text-2xl font-light">{t("invitees")}:</h2>
              {(event.privacy_level>1 || event.host_id == currentUser.id) && invitations.data.map((invitation, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`bg-muted px-1 text-lg font-light hover:bg-muted/40 sm:text-xl ${
                        (event.privacy_level === 3 || event.host_id == currentUser.id) &&
                        responses.data?.some(
                          (resp) =>
                            resp.invitee_id === invitation.invitee_id &&
                            resp.is_accepted,
                        )
                          ? "border-success bg-success/40"
                          : responses.data?.some(
                                (resp) =>
                                  resp.invitee_id === invitation.invitee_id &&
                                  !resp.is_accepted,
                              )
                            ? "border-destructive bg-destructive/40"
                            : ""
                      }`}
                    >
                      {invitees.data[index]?.nickname ??
                        invitees.data[index]?.name}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className={`flex w-fit flex-col items-center justify-start gap-2 bg-muted/40 backdrop-blur-lg ${event.privacy_level === 3 && responses.data?.some((resp) => resp.invitee_id === invitation.invitee_id && resp.is_accepted) ? "bg-success/15 border-success" 
                      :  responses.data?.some(resp=>resp.invitee_id === invitation.invitee_id && !resp.is_accepted)
                      ? "bg-destructive/15 border-destructive"
                      : ""}`}
                  >
                    <p>{invitees.data[index]?.name}</p>
                    <p>{invitees.data[index]?.email}</p>
                    {event.privacy_level === 3 &&
                      responses.data?.some(
                        (resp) =>
                          resp.invitee_id === invitation.invitee_id &&
                          resp.is_accepted,
                      ) ? (
                        <Badge variant={"success"} className="border-success bg-muted w-fit text-foreground">
                          {t("accepted")} 
                        </Badge>
                      ): responses.data?.some(resp=>resp.invitee_id === invitation.invitee_id && !resp.is_accepted)
                      ? <Badge variant={"destructive"} className="border-destructive bg-muted/40 w-fit text-foreground">
                      {t("declined")} 
                    </Badge>
                      : ""}
                    <PopoverClose asChild>
                      {event.host_id === currentUser?.id ? (
                        <Button
                          onClick={() =>
                            handleDeleteInvitation(
                              invitation.event_id,
                              invitation.invitee_id,
                            )
                          }
                          variant="outline"
                          className="text-md bg-muted font-bold text-destructive hover:bg-muted/40 px-2"
                        >
                          <Trash className="mx-1 text-destructive" />
                          <p>{t("uninvite")}</p>
                        </Button>
                      ) : null}
                    </PopoverClose>
                  </PopoverContent>
                </Popover>
              ))}
                            {event.host_id == currentUser.id && (
                <InvitationForm eventId={eventId} event={event} />
              )}

            </div>
          ) : 
            (event.privacy_level>1 || event.host_id == currentUser.id) ? <div className="flex flex-row flex-wrap items-center gap-2">
              <p className="text-2xl font-light">No invitees yet</p>
              {event.host_id == currentUser.id && (
                <InvitationForm eventId={eventId} event={event} />
              )}
            </div>
          : null}
        </div>
    );
  }
}
