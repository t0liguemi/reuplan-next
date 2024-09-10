import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import AllEventsPage from "./allEvents";
import { invitation, response } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function AdminAllEventsPage() {
  const session = await auth();
  if (!session?.user.isAdmin) {
    redirect("/events/");
  }
  const events = await db.query.event.findMany();
  const users = await db.query.users.findMany();

  async function deleteInvitation(eventId: string, userId: string) {
    "use server";
    const deletion = await db.delete(invitation).where(and(eq(invitation.event_id, eventId),eq(invitation.invitee_id,userId))).returning({invitee: invitation.invitee_id,event: invitation.event_id});
    return deletion
  }
  async function deleteResponse(id: string) {
    "use server";
    const deletion = await db.delete(response).where(eq(response.id, id)).returning({id: response.id});
    return deletion
  }

  return (
    <div>
      <div className="my-4 flex flex-col px-12">
        <div className="my-4 flex gap-4">
          <h1 className="text-4xl font-extrabold">All Events</h1>
          <Link href="/events/">
            <Button>Back to Events</Button>
          </Link>
        </div>
        <h1 className="text-xl font-light my-4"> This Admin-only page allows you to manage all events, including deleting responses and invitations.</h1>
        <AllEventsPage users={users} events={events} deleteInvitation={deleteInvitation} deleteResponse={deleteResponse}/>
      </div>
    </div>
  );
}
