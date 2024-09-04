"use server";
import { db } from "./db/index";
import { and, eq, } from "drizzle-orm";
import { event, invitation, response, users } from "./db/schema";
import { revalidatePath } from "next/cache";
import { signIn, signOut } from "auth";


export async function loginAttempt(provider: string) {
  await signIn(provider);
}

export async function logoutAttempt() {
  await signOut();
}

export async function revalidateFromServer(path: string) {
  revalidatePath(path);
}


export async function getUser(
  id: string,
): Promise<typeof users.$inferSelect | undefined> {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  return user;
}

export async function getInviteesProfiles(
  eventId: string,
): Promise<(typeof users.$inferSelect)[]> {
  const invitations = await db.query.invitation.findMany({
    where: eq(invitation.event_id, eventId),
  });
  const invitees: (typeof users.$inferSelect)[] = [];
  for (const invitation of invitations) {
    const query_user = await db.query.users.findFirst({
      where: eq(users.id, invitation.invitee_id),
    });
    if (query_user) {
      invitees.push(query_user);
    }
  }
  return invitees;
}

export async function queryUsers(
  query: string,
  field: "id" | "email" | "username",
): Promise<typeof users.$inferSelect | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, query),
  });
  return user;
}

type Evento = typeof event.$inferSelect;

export async function getCurrentUsersEvents(userID: string): Promise<Evento[]> {
  const receivedInvitations = await db.query.invitation.findMany({
    where: (invitation, { eq }) => eq(invitation.invitee_id, userID),
  });
  const invitedEvents: Evento[] = [];
  for (const invitation of receivedInvitations) {
    const query_event = await db.query.event.findFirst({
      where: eq(event.id, invitation.event_id),
    });
    if (query_event) {
      invitedEvents.push(query_event);
    }
  }
  const ownEvents = await db.query.event.findMany({
    where: eq(event.host_id, userID),
  });
  ownEvents.forEach((event) => {
    if (!invitedEvents.some((invitedEvent) => invitedEvent.id === event.id)) {
      invitedEvents.push(event);
    }
  });
  return invitedEvents;
}

export async function updateUserNames(userData: {
  id: string;
  nickname?: string;
  name: string;
  show_email: boolean;
}) {
  const user = await db
    .update(users)
    .set(
      userData
    )
    .where(eq(users.id, userData.id))
    .returning({
      id: users.id,
      nickname: users.nickname,
      name: users.name,
      showEmail: users.showEmail,
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  return user;
}

export async function postEvent(targetEvent:
  {
    name: string;
    location: string | null;
    from: Date;
    to: Date;
    description: string | null;
    privacy_level: number;
    maps_query: boolean;
    host_id: string;
    updated_at: Date;
    created_at: Date;
  }
) {
  const newEvent = await db
    .insert(event)
    .values(targetEvent)
    .returning({ id: event.id });
  if (newEvent[0]) {
    console.log(newEvent);
    return newEvent[0].id;
  } else {
    return false;
  }
}

export async function postInvitation(
  targetInvitation: typeof invitation.$inferInsert,
) {
  const newInvitation = await db
    .insert(invitation)
    .values(targetInvitation)
    .returning({ invitee: invitation.invitee_id, event: invitation.event_id })
    .catch((err) => {
      console.log(err);
      return false;
    });
  return newInvitation;
}

export async function postResponse(
  targetResponse:{
    event_id: string;
    invitee_id: string;
    is_accepted: boolean;
    date: Date;
    start_time: Date;
    end_time: Date;
  }
) {
  const newResponse = await db
    .insert(response)
    .values(targetResponse)
    .returning({ id: response.id });
  if (newResponse[0]) {
    console.log(newResponse);
    return newResponse[0].id;
  } else {
    return false;
  }
}

export async function getInvitations(
  eventId: string,
): Promise<(typeof invitation.$inferSelect)[]> {
  //* RETURNS ALL INVITATIONS FOR A GIVEN EVENT */
  const invitations = await db.query.invitation.findMany({
    where: eq(invitation.event_id, eventId),
  });
  return invitations;
}

export async function getResponses(
  eventId: string,
): Promise<(typeof response.$inferSelect)[]> {
  //* RETURNS ALL RESPONSES FOR A GIVEN EVENT */
  const responses = await db.query.response.findMany({
    where: eq(response.event_id, eventId),
  });
  return responses;
}

export async function deleteInvitation(
  eventId: string,
  inviteeId: string,
): Promise<string | undefined> {
  const deletedInvitation = await db
    .delete(invitation)
    .where(
      and(
        eq(invitation.event_id, eventId),
        eq(invitation.invitee_id, inviteeId),
      ),
    )
    .returning({ inviteeId: invitation.invitee_id });
  if (deletedInvitation[0]) {
    return deletedInvitation[0].inviteeId;
  } else {
    return undefined;
  }
}

export async function deleteResponse(
  responseId: string,
): Promise<string | undefined> {
  const deletedResponse = await db
    .delete(response)
    .where(eq(response.id, responseId))
    .returning({ inviteeId: response.invitee_id });
  if (deletedResponse[0]) {
    return deletedResponse[0].inviteeId;
  } else {
    return undefined;
  }
}

export async function editEvent(
  targetEvent: Evento,
): Promise<string | undefined> {
  const updatedEvent = await db
    .update(event)
    .set(targetEvent)
    .where(eq(event.id, targetEvent.id))
    .returning({ id: event.id });
  if (updatedEvent[0]) {
    return updatedEvent[0].id;
  } else {
    return undefined;
  }
}

export async function deleteEvent(id: string): Promise<string | undefined> {
  const deletedEvent = await db
    .delete(event)
    .where(eq(event.id, id))
    .returning({ id: event.id });
  if (deletedEvent[0]) {
    return deletedEvent[0].id;
  } else {
    return undefined;
  }
}

export async function getCurrentUserResponses(
  userId: string,
): Promise<(typeof response.$inferSelect)[]> {
  const responses = await db.query.response.findMany({
    where: eq(response.invitee_id, userId),
  });
  return responses;
}

export async function getCurrentUserInvitations(
  userId: string,
): Promise<(typeof invitation.$inferSelect)[]> {
  const invitations = await db.query.invitation.findMany({
    where: eq(invitation.invitee_id, userId),
  });
  return invitations;
}

export async function rejectEvent(id: string, invitee_id: string) {
  const rejectedEvent = await db.insert(response).values({
    event_id: id,
    invitee_id: invitee_id,
    is_accepted: false,
  }).returning({ id: response.id }).catch((err) => {console.log(err);return false})
  return rejectedEvent;
}

export async function deleteRejection(id: string, invitee_id: string) {
  const deletedRejection = await db
    .delete(response)
    .where(
      and(
        eq(response.event_id, id),
        eq(response.invitee_id, invitee_id),
        eq(response.is_accepted, false),
      ),
    )
    .returning({ id: response.id });
  if (deletedRejection[0]) {
    return deletedRejection[0].id;
  } else {
    return undefined;
  }
}