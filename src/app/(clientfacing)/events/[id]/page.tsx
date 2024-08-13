import React from "react";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { event  } from "~/server/db/schema";
import { getUser, getUsers } from "~/server/actions";

import MainEventView from "./mainEventView";

import { permanentRedirect } from "next/navigation";


export default async function EventPage({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const queryEvent = await db.query.event.findFirst({
    where: eq(event.id, id),
  });
  if (queryEvent) {

  const allUsers = await getUsers()
  const organizer = allUsers.find((user) => user.user_id === queryEvent.host_id);


  if (queryEvent && organizer) {
    return (
      <div className="container">
        <MainEventView
          event={queryEvent}
          organizer={organizer}
          allUsers={allUsers}
        />
      </div>
    ); }
    else{
      permanentRedirect("/events");
    }
}}
