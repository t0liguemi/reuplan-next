"use client";
import type { event as eventType } from "~/server/db/schema";
import { Popover, PopoverContent, PopoverTrigger, } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import MapsDrawer from "./mapsDrawer";
import type { User } from "auth0";
import InvitationForm from "./invitationForm";
import InviteesList from "./inviteesList";
import { getInvitations, getResponses, getUsers } from "~/server/actions";
import Responses from "./responses";
import { useQueries } from "@tanstack/react-query";


export default function MainEventView(props: {
  event: typeof eventType.$inferSelect;
  organizer: User
  allUsers: User[]
}) {
  const { event, organizer,allUsers  } = props;
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;



  const eventData = useQueries({
    queries: [
      {queryKey: ["responses"],
      queryFn: () => getResponses(event.id)},
    
      {queryKey: ["invitees"],
      queryFn: () => getInvitations(event.id)}]
    }
  )

    return (
      <div>
        <h1 className="mb-4 mt-0 py-0 text-5xl font-bold">
          <span className="text-4xl font-light">Event: </span>
          {event.name}
        </h1>

        <div className="my-2 flex flex-row items-baseline text-2xl">
          <p className="font-light">Host: </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mx-2 bg-muted px-1 text-2xl font-bold"
              >
                {organizer.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-transparent bg-opacity-40 backdrop-blur-lg">
              <div className="flex flex-col text-lg font-normal">
                <p>{organizer.name}</p>
                <p>{organizer.email}</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <p className="my-4 text-2xl font-light" id="event-date">  
          From{" "}
          <span className="font-bold">
            {new Date(event.from).toLocaleDateString("en-US", options)}
          </span>{" "}
          to{" "}
          <span className="font-bold">
            {new Date(event.to).toLocaleDateString("en-US", options)}
          </span>
        </p>

        <div id="event-location" className="my-4">
          {event.location && !event.maps_query && (
            <p className="my-2 text-2xl font-light">
              Location: <span className="font-bold">{event.location}</span>
            </p>
          )}
          {event.location && event.maps_query && (
            <div className="my-2 flex flex-row items-baseline text-2xl">
              <p className="font-light">Location: </p>
              <MapsDrawer location={event.location} />
            </div>
          )}
        </div>

        <InviteesList query={eventData[1]} eventId={event.id} users={allUsers} />

        <Responses query={eventData[0]} eventId={event.id} />

        <p className="my-8 text-xl font-light">Description: <span className="font-normal">{event.description}</span></p>
        
        <InvitationForm eventId={event.id} />
      </div>
    );
  
}
