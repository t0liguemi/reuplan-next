"use client";
import { Button } from "~/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryUsers, getUser } from "~/server/actions";
import { postInvitation } from "~/server/actions";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { invitationDialogOpen } from "./invitationForm";
import React from "react";
import sendInvitationEmail from "~/server/send-invitation";
import { useSession } from "next-auth/react";
import type { event as eventType } from "~/server/db/schema";

export default function UserQuery(props: {
  eventId: string;
  userEmail: string;
  event: typeof eventType.$inferSelect;
}) {
  const session = useSession();
  const queryClient = useQueryClient();
  const setIsOpen = useSetAtom(invitationDialogOpen);
  const [isInviting, setIsInviting] = React.useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["users", props.userEmail, props.eventId],
    queryFn: () => queryUsers(props.userEmail.toLowerCase(), "email"),
  });

  async function executeInvite(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    if (data) {
      if (data.id) {
        setIsInviting(true);
        const newInvite = await postInvitation({
          event_id: props.eventId,
          invitee_id: data.id,
        });
        if (newInvite === false) {
          toast("User already invited");
          setIsInviting(false);
          return;
        }
        if (newInvite) {
          const invitedUser = await getUser(data.id);
          await queryClient.invalidateQueries({ queryKey: ["invitees"] });
          await queryClient.invalidateQueries({ queryKey: ["responses"] });
          await queryClient.invalidateQueries({ queryKey: ["invitations"] });
          await queryClient.invalidateQueries({ queryKey: ["userEvents"] });
          await queryClient.invalidateQueries({ queryKey: ["userResponses"] });
          await queryClient.invalidateQueries({
            queryKey: ["userInvitations"],
          });

          setIsOpen(false);
          setIsInviting(false);
          if (invitedUser && session.data?.user.id) {
            const emailSent = await sendInvitationEmail(data.id, props.eventId, session.data.user.id);
            if (emailSent) {
              toast.success(
              "Invitation sent!" + " Invited user " + invitedUser?.name + ", also sent an email 📧.",
            );}
            else{
              toast.success("Invitation sent!" + " Invited user " + invitedUser?.name + ". Email could not be sent.")
            }
          }
        } else {
          toast.error("Invitation failed!");
          setIsInviting(false);
        }
      }
    }
  }

  if (isLoading) {
    return (
      <Button className="min-w-28" disabled>
        Searching...
      </Button>
    );
  }
  if (data) {
    return (
      <Button
        type="submit"
        onClick={(e) => executeInvite(e)}
        className="min-w-28"
        disabled={isInviting}
      >
        Invite
      </Button>
    );
  } else {
    return (
      <Button className="min-w-28" disabled>
        Not found
      </Button>
    );
  }
}
