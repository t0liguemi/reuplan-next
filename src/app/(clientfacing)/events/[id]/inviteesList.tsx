"use client";

import { User } from "auth0";

import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { deleteInvitation, getInvitations } from "~/server/actions";
import { invitation } from "~/server/db/schema";
import { DeleteIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { PopoverClose } from "@radix-ui/react-popover";

export default function InviteesList(props: {
  query: UseQueryResult<(typeof invitation.$inferSelect)[], Error>;
  eventId: string;
  users: User[];
}) {
  const queryClient = useQueryClient();
  const { query, eventId, users } = props;
  const { isLoading, data, error } = query;

  const invitees = data?.map((invitation) => {
    const user = users.find((user) => user.user_id === invitation.invitee_id);
    if (user) {
      return user;
    }
    return;
  });

  async function handleDeleteInvitation(invitationId: string) {
    const deletedInvitation = await deleteInvitation(invitationId);
    await queryClient.invalidateQueries({ queryKey: ["responses"], });
    await queryClient.invalidateQueries({ queryKey: ["invitees"], });
    if (deletedInvitation) {
      const deletedUser = users.find(
        (user) => user.user_id === deletedInvitation,
      );
      toast.success(
        `Inivitation deleted. User ${deletedUser?.name ?? deletedUser?.email} was uninvited`,
      );
    } else {
      toast.error(`Error deleting invitation`);
    }
  }

  if (error) {
    return <div className="my-4 text-2xl font-light">Invitees: Error loading</div>;
  }
  if (isLoading) {
    return (
      <div className="my-4 flex flex-row flex-wrap justify-start gap-2 align-baseline">
        <h2 className="text-2xl font-light">Invitees:</h2>
        <Skeleton className="h-[28px] w-[128px]" />
        <Skeleton className="h-[28px] w-[128px]" />
        <Skeleton className="h-[28px] w-[128px]" />
        <Skeleton className="h-[28px] w-[128px]" />
      </div>
    );
  }
  if (data && invitees) {
    return (
      <div className="my-4 flex flex-row items-baseline gap-2">
        <h2 className="text-2xl font-light">Invitees:</h2>
        <div className="flex flex-row flex-wrap items-baseline gap-2 text-2xl font-light">
          {data.length > 0 ? (
            data.map((invitation, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="bg-muted px-1 text-xl font-light"
                  >
                    {invitees[index]?.name ?? invitees[index]?.email}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="bg-transparent backdrop-blur-lg">
                  <div className="flex flex-col text-lg font-normal">
                    {" "}
                    <p>{invitees[index]?.name}</p>
                    <p>{invitees[index]?.email}</p>
                    <PopoverClose asChild>
                      <Button
                        onClick={() => handleDeleteInvitation(invitation.id)}
                        variant="outline"
                        className="text-md bg-muted px-1 font-bold text-destructive"
                      >
                        <Trash className="mx-1 text-destructive" />
                        <p>Delete Invitation</p>
                      </Button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            ))
          ) : (
            <p>No invitees yet</p>
          )}
        </div>
      </div>
    );
  }
}
