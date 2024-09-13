import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { event, users  } from "~/server/db/schema";

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
    const organizer = await db.query.users.findFirst({where: eq(users.id,queryEvent.host_id)})
    
    if (organizer) return (
      <div className="md:px-6 px-2 lg:px-12 mb-16 w-screen">
        <MainEventView
          event={queryEvent}
          organizer={organizer}
        />
      </div>
    ); }
    else{
      permanentRedirect("/events");
    }
}
