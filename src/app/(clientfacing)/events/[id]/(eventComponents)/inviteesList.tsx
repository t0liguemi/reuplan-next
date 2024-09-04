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
import type { users, event, invitation } from "~/server/db/schema";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import InvitationForm from "./invitationForm";
import { useSession } from "next-auth/react";
import { PopoverClose } from "@radix-ui/react-popover";
import React from "react";

export default function InviteesList(props: {
  invitations: UseQueryResult<(typeof invitation.$inferSelect)[], Error>;
  eventId: string;
  event: typeof event.$inferSelect;
  invitees: UseQueryResult<(typeof users.$inferSelect)[], Error>;
}) {
  const queryClient = useQueryClient();
  const { invitations, eventId, event, invitees } = props;
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
      toast("You are not invited to this event!");
    }
    if (invitations.data?.length === 0) {
      toast("This event has no invitees yet. Start by inviting someone!");
    }
  }, [isInvited, invitations.data, currentUser,event]);

  async function handleDeleteInvitation(eventId: string, invitationId: string) {
    const deletedInvitation = await deleteInvitation(eventId, invitationId);
    if (deletedInvitation) {

      const deletedUser = await getUser(deletedInvitation);
      if (deletedUser) {
        toast.success(
          `Invitation deleted. User ${deletedUser?.nickname ?? deletedUser?.name ?? ""} was uninvited.`,
        );
      }
      await queryClient.invalidateQueries({ queryKey: ["invitees"] });
      await queryClient.invalidateQueries({ queryKey: ["responses"] });
      await queryClient.invalidateQueries({ queryKey: ["invitations"] });
      await queryClient.invalidateQueries({ queryKey: ["userEvents"] });
      await queryClient.invalidateQueries({ queryKey: ["userResponses"] });
      await queryClient.invalidateQueries({ queryKey: ["userInvitations"] });
    } else {
      toast.error(`Error deleting invitation`);
    }
  }

  if (invitations.error ?? invitees.error) {
    return (
      <div className="my-4 text-2xl font-light">Invitees: Error loading</div>
    );
  }
  if (invitations.isLoading || invitees.isLoading) {
    return (
      <div className="align-center flex flex-row flex-wrap justify-start gap-2">
        <h2 className="text-2xl font-light">Invitees:</h2>
        <Skeleton className="h-[40px] w-[128px]" />
        <Skeleton className="h-[40px] w-[148px]" />
        <Skeleton className="h-[40px] w-[96px]" />
        <Skeleton className="h-[40px] w-[112px]" />
        <Skeleton className="h-[40px] w-[128px]" />
        <Skeleton className="h-[40px] w-[96px]" />
        <Skeleton className="h-[40px] w-[148px]" />
        <Skeleton className="h-[40px] w-[88px]" />
        {currentUser?.id === event.host_id && (
          <InvitationForm eventId={eventId} />
        )}
      </div>
    );
  }
  if (invitations.data && invitees.data && currentUser) {
    return (
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <h2 className="text-2xl font-light">Invitees:</h2>
        <div className="flex flex-row flex-wrap items-baseline gap-2 text-2xl font-light">
          {invitations.data.length > 0 ? (
            <div className="flex flex-row flex-wrap items-baseline gap-1 sm:gap-2">
              {invitations.data.map((invitation, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="bg-muted px-1 text-lg font-light hover:bg-muted/40 sm:text-xl"
                    >
                      {invitees.data[index]?.nickname ??
                        invitees.data[index]?.name}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="bg-muted/40 backdrop-blur-lg">
                    <div className="flex flex-col text-lg font-light">
                      {" "}
                      <p>{invitees.data[index]?.name}</p>
                      <p>{invitees.data[index]?.email}</p>
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
                            className="text-md bg-muted px-1 font-bold text-destructive hover:bg-muted/40"
                          >
                            <Trash className="mx-1 text-destructive" />
                            <p>Uninvite</p>
                          </Button>
                        ) : null}
                      </PopoverClose>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {event.host_id == currentUser.id && (
                <InvitationForm eventId={eventId} />
              )}
            </div>
          ) : (
            <div className="flex flex-row flex-wrap items-center gap-2">
              <p>No invitees yet</p>
              {event.host_id == currentUser.id && (
                <InvitationForm eventId={eventId} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
