"use server";
import { db } from "./db/index";
import { and, eq } from "drizzle-orm";
import {
  anon_event,
  anon_participant,
  anon_response,
  event,
  invitation,
  response,
  users,
} from "./db/schema";
import { revalidatePath } from "next/cache";
import { signIn, signOut } from "auth";

import { addDays } from "date-fns";

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
    .set(userData)
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

export async function postEvent(targetEvent: {
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
}) {
  const newEvent = await db
    .insert(event)
    .values(targetEvent)
    .returning({ id: event.id });
  return newEvent;
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

export async function postResponse(targetResponse: {
  event_id: string;
  invitee_id: string;
  is_accepted: boolean;
  date: Date;
  start_time: Date;
  end_time: Date;
}) {
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
  const rejectedEvent = await db
    .insert(response)
    .values({
      event_id: id,
      invitee_id: invitee_id,
      is_accepted: false,
    })
    .returning({ id: response.id })
    .catch((err) => {
      console.log(err);
      return false;
    });
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

export async function createAnonEvent() {
  function randomString(len: number) {
    const p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...Array<string>(len)].reduce(
      (a:string) => a + p[~~(Math.random() * p.length)],
      "",
    );
  }
  const today = new Date();
  const newString = (randomString(4) + "-" + randomString(4)).toUpperCase();
  const event: typeof anon_event.$inferInsert = {
    code: newString,
    from: new Date(today.setHours(0, 0, 0, 0)),
    to: addDays(new Date(today.setHours(0, 0, 0, 0)), 1),
    created_at: new Date(),
    expires_at: addDays(new Date(), 7),
  };
  const newEvent = await db
    .insert(anon_event)
    .values(event)
    .returning({ code: anon_event.code });
  return newEvent;
}

export async function getAnonEvent(code: string) {
  const event = await db.query.anon_event.findFirst({
    where: eq(anon_event.code, code),
  });
  return event;
}

export async function editAnonEvent(code: string, from: Date, to: Date) {
  const updatedEvent = await db
    .update(anon_event)
    .set({
      from: from,
      to: to,
      expires_at: addDays(new Date(), 7),
    })
    .where(eq(anon_event.code, code))
    .returning({ code: anon_event.code });
  return updatedEvent;
}

export async function createAnonParticipant(
  newParticipant: typeof anon_participant.$inferInsert,
) {
  const participant = await db
    .insert(anon_participant)
    .values(newParticipant)
    .returning({ name: anon_participant.name });
  return participant;
}

export async function getAnonParticipants(eventId: string) {
  const participants = await db.query.anon_participant.findMany({
    where: eq(anon_participant.anon_event_id, eventId),
  });
  return participants;
}

export async function deleteAnonParticipant(participantId: string) {
  const deletedParticipant = await db
    .delete(anon_participant)
    .where(eq(anon_participant.id, participantId))
    .returning({ id: anon_participant.id });
  if (deletedParticipant[0]) {
    return deletedParticipant[0].id;
  } else {
    return undefined;
  }
}

export async function createAnonSchedule(
  code: string,
  date: Date,
  from: Date,
  to: Date,
  userId: string,
) {
  const newSchedule = await db
    .insert(anon_response)
    .values({
      event_id: code,
      date: date,
      start_time: from,
      end_time: to,
      participant_id: userId,
    })
    .returning({ id: anon_response.id });
  return newSchedule;
}

export async function getAnonResponses(eventId: string) {
  const responses = await db.query.anon_response.findMany({
    where: eq(anon_response.event_id, eventId),
  });
  return responses;
}

export async function deleteAnonResponse(responseID: string) {
  const response = await db
    .delete(anon_response)
    .where(eq(anon_response.id, responseID))
    .returning({ id: anon_response.id });
  return response;
}
