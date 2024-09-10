"use client";
import React from "react";

import {
  invitation,
  response,
  type event,
  type users,
} from "~/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DeleteIcon } from "lucide-react";
import { toast } from "sonner";
import {
  deleteInvitation,
  getInvitations,
  getResponses,
} from "~/server/actions";
import { format } from "date-fns";

export default function AllEventsPage(props: {
  users: (typeof users.$inferSelect)[];
  events: (typeof event.$inferSelect)[];
  deleteInvitation: (
    eventId: string,
    userId: string,
  ) => Promise<{ invitee: string; event: string }[]>;
  deleteResponse: (id: string) => Promise<{ id: string }[]>;
}) {
  const { users, events, deleteInvitation, deleteResponse } = props;

  const [selectedUser, setSelectedUser] = React.useState<string>("");
  const [selectedEvent, setSelectedEvent] = React.useState<string>("");

  const filteredEvents = React.useMemo(() => {
    if (selectedUser === "") {
      return events;
    }
    return events.filter((event) => event.host_id === selectedUser);
  }, [events, selectedUser]);

  return (
    <div>
      <Select onValueChange={(value) => setSelectedUser(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="my-6 flex w-full flex-col gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="flex flex-row justify-between rounded-md border-2 border-border bg-muted/60 p-2 font-light"
          >
            <div
              className="flex flex-col gap-2"
            >
              <p>
                Event Name: <span className="font-extrabold">{event.name}</span>{" "}
              </p>
              <p>
                Host:{" "}
                <span className="font-extrabold">
                  {users.find((user) => user.id === event.host_id)?.email}
                </span>
              </p>
              <p>
                Event ID: <span className="font-extrabold">{event.id}</span>
              </p>
              <p>
                Privacy Level: <span className="font-extrabold">{event.privacy_level}</span>
              </p>
              <p>
                From {format(event.from ?? new Date(), "PP")} to {format(event.to ?? new Date(), "PP")}
              </p>
            </div>
            <ParticipationDrawer
              event={event}
              users={users}
              deleteInvitation={deleteInvitation}
              deleteResponse={deleteResponse}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParticipationDrawer(props: {
  event: typeof event.$inferSelect;
  users: (typeof users.$inferSelect)[];
  deleteInvitation: (
    eventId: string,
    userId: string,
  ) => Promise<{ invitee: string; event: string }[]>;
  deleteResponse: (id: string) => Promise<{ id: string }[]>;
}) {
  const {
    event,
    users,
    deleteInvitation,
    deleteResponse,
  } = props;
  const queryClient = useQueryClient();

  const invitations = useQuery({
    queryKey: ["adminInvitation", event.id],
    queryFn: () => getInvitations(event.id),
  });

  const responses = useQuery({
    queryKey: ["adminResponses", event.id],
    queryFn: () => getResponses(event.id),
  });

  async function triggerInvitationDeletion(eventId: string, userId: string) {
    const deletion = await deleteInvitation(eventId, userId);
    if (deletion[0]) {
      await queryClient.invalidateQueries({
        queryKey: ["adminInvitation", event.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["adminResponses", event.id],
      });
      toast.success("Invitation deleted");
    }
  }

  async function triggerResponseDeletion(id: string) {
    const deletion = await deleteResponse(id);
    if (deletion[0]) {
      await queryClient.invalidateQueries({
        queryKey: ["adminResponses", event.id],
      });
      toast.success("Response deleted");
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="mx-6 bg-muted text-sm font-light">
          See participation
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background/40 p-6 backdrop-blur-lg dark:bg-muted/20">
        {(responses.isError || invitations.isError) ? <div>Error</div>:
        (responses.isFetching || invitations.isFetching) ? <div>Loading...</div>:
        responses.data && invitations.data ? (
          <div>
            <DrawerHeader>
              <DrawerTitle>
                Participation for event <strong>{event.name}</strong>
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-row flex-wrap gap-4">
              <Table className="w-fit">
                <TableCaption>
                  Invitations for event {event.name} by{" "}
                  {users.find((user) => user.id === event.host_id)?.name}({users.find((user) => user.id === event.host_id)?.email})
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invitee ID</TableHead>
                    <TableHead>Invitee Name</TableHead>
                    <TableHead>
                      Invitee Email
                    </TableHead> <TableHead></TableHead>{" "}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.data.map((invitation) => (
                    <TableRow key={invitation.event_id + invitation.invitee_id}>
                      <TableCell>{invitation.invitee_id}</TableCell>
                      <TableCell>
                        {
                          users.find(
                            (user) => user.id === invitation.invitee_id,
                          )?.name
                        }
                      </TableCell>
                      <TableCell>
                        {
                          users.find(
                            (user) => user.id === invitation.invitee_id,
                          )?.email
                        }
                      </TableCell>
                      <TableCell>
                        <button>
                          <DeleteIcon
                            className="h-8 w-8 text-destructive"
                            onClick={async () => {
                              await triggerInvitationDeletion(
                                event.id,
                                invitation.invitee_id,
                              );
                            }}
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Table className="w-fit">
                <TableCaption>Responses for event {event.name} by {users.find((user) => user.id === event.host_id)?.name}({users.find((user) => user.id === event.host_id)?.email})</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invitee Name</TableHead>
                    <TableHead>Invitee Email</TableHead>
                    <TableHead>Response</TableHead> <TableHead></TableHead>{" "}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.data.map((response) => (
                    <TableRow key={response.event_id + response.invitee_id}>
                      <TableCell>
                        {
                          users.find((user) => user.id === response.invitee_id)
                            ?.name
                        }
                      </TableCell>
                      <TableCell>
                        {
                          users.find((user) => user.id === response.invitee_id)
                            ?.email
                        }
                      </TableCell>
                      <TableCell>
                        {response.is_accepted
                          ? format(response.start_time ?? new Date(), "Pp") +
                            " - " +
                            format(response.end_time ?? new Date(), "Pp")
                          : "Rejected"}
                      </TableCell>
                      <TableCell>
                        <button>
                          <DeleteIcon
                            className="h-8 w-8 text-destructive"
                            onClick={async () => {
                              await triggerResponseDeletion(response.id);
                            }}
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ):null}
      </DrawerContent>
    </Drawer>
  );
}
