import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { event, users  } from "~/server/db/schema";

import MainEventView from "./mainEventView";

import { permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { id: id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const t = await getTranslations("EventPage");
  const queryEvent = await db.query.event.findFirst({
    where: eq(event.id, id),
  });
  if(queryEvent){return {title: `${t("title")} - ${queryEvent.name}`} 
  }else {return {title: "Reuplan"}}
}


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
