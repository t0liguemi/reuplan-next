"use client";
import { Button } from "~/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryUsers } from "~/server/actions";
import { postInvitation } from "~/server/actions";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { invitationDialogOpen } from "./invitationForm";


export default function UserQuery(props: {
  eventId: string;
  userEmail: string;
}) {
  const queryClient = useQueryClient();
  const setIsOpen = useSetAtom(invitationDialogOpen);

  const { isLoading, data, error } = useQuery({
    queryKey: ["users", props.userEmail],
    queryFn: () => queryUsers(props.userEmail, "email"),
    initialData:[]
  });

  async function executeInvite(e:React.MouseEvent<HTMLButtonElement,MouseEvent>) {
    e.preventDefault(); 
    setIsOpen(false);
    const newInvite = data[0]?.user_id? await postInvitation({
          event_id: props.eventId,
          invitee_id: data[0].user_id
        }): null;
    if (newInvite) {
      await queryClient.invalidateQueries({queryKey: ["invitees"]});
      await queryClient.invalidateQueries({queryKey: ["responses"]}); 
      toast.success("Invitation sent!\n" + JSON.stringify(newInvite));
    } else {
      toast.error("Invitation failed!");
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
      <Button type="submit" onClick={e=>executeInvite(e)} className="min-w-28">
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
