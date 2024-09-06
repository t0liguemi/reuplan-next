"use client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  getCurrentUserInvitations,
  getCurrentUserResponses,
  getCurrentUsersEvents,
} from "~/server/actions";

export default function EventList(props: { userID: string }) {
  const { userID } = props;
  const userEvents = useQuery({
    queryKey: ["userEvents"],
    queryFn: () => getCurrentUsersEvents(userID),
  });

  const userResponses = useQuery({
    queryKey: ["userResponses"],
    queryFn: () => getCurrentUserResponses(userID),
  });

  const userInvitations = useQuery({
    queryKey: ["userInvitations"],
    queryFn: () => getCurrentUserInvitations(userID),
  });

  if (userEvents.isLoading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[68px] w-full" />
        <Skeleton className="h-[68px] w-full" />
        <Skeleton className="h-[68px] w-full" />
      </div>
    );

  if (userEvents.error)
    return <div className="flex flex-col gap-4">Error loading data</div>;

  if (userEvents.data)
    return (
      <div className="flex flex-col gap-4">
        {userEvents.data?.length > 0 ? (
          userEvents.data.map((event, index) => {
            return (
              <Link
                href={`/events/${event.id}`}
                key={index}
                className="border-border-/20 flex flex-row items-center justify-between rounded-md border-2 bg-muted/30 p-4 hover:border-secondary hover:bg-muted/80"
              >
                <div className="flex flex-col">
                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    {event.name}

                    {event.host_id === userID && (
                      <Badge variant={"outline"} className="border-primary">Own👑</Badge>
                    )}

                    {!userResponses.data?.some(
                      (resp) => resp.event_id === event.id,
                    ) &&
                    userInvitations.data?.some(
                      (inv) => inv.invitee_id === userID,
                    ) ? (
                      <Badge variant={"outline"} className="border-destructive">Pending❗</Badge>
                    ) : userResponses.data?.some(
                        (resp) =>
                          resp.event_id === event.id && !resp.is_accepted,
                      ) ? (
                      <Badge variant={"outline"} className="border-destructive">Rejected❌</Badge>
                    ) : (
                      <Badge variant={"outline"} className="border-success">Answered✅</Badge>
                    )}

                  </h2>
                </div>
                <div className="min flex min-w-[150px] flex-col">
                  <p className="text-sm text-wrap">
                    {format(event.from,"dd/MM/yy")}{" - "}
                    {format(event.to,"dd/MM/yy")}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-2xl font-light">No events, create one!</p>
        )}
      </div>
    );
}
