"use server";
import { env } from "~/env";
import axios from "axios";
import type * as _ from "auth0";
import { db } from "./db/index";
import { eq, or } from "drizzle-orm";
import { event, invitation, response } from "./db/schema";

export async function getApiKey(): Promise<_.TokenResponse> {
  const options = {
    method: "POST",
    url: "https://dev-wnu4n5y3632k0xxd.us.auth0.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.AUTH_AUTH0_ID,
      client_secret: env.AUTH_AUTH0_SECRET,
      audience: "https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/",
    }),
  };

  const data = await axios
    .request<_.TokenResponse>(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
      return Promise.reject(error);
    });

  return data;
}

export async function getUsers(): Promise<_.UserData[]> {

  //* GATHERS ALL USERS FROM AUTH0 AND RETURNS THEM AS AN ARRAY OF USERS */

  const apiKey = await getApiKey();

  const options = {
    method: "GET",
    url: "https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/users",
    headers: { authorization: `Bearer ${apiKey.access_token}` },
  };

  const data = await axios
    .request<_.UserData[]>(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
      return Promise.reject(error);
    });
  return data;
}

export async function getRoles(id: string): Promise<_.Role[]> {
  const apiKey = await getApiKey();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiKey.access_token}`,
    },
    url: `https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/users/${id}/roles`,
    redirect: "follow",
  };
  const roles = await axios
    .request<_.Role[]>(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return Promise.reject(error);
    });

  return roles;
}

export async function getUser(id: string): Promise<_.UserData> {
  const apiKey = await getApiKey();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiKey.access_token}`,
    },
    url: `https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/users/${id}`,
    redirect: "follow",
  };
  const user = await axios
    .request<_.UserData>(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return Promise.reject(error);
    });

  return user;
}

export async function queryUsers(
  query: string,
  field: "id" | "email" | "username",
): Promise<_.UserData[]> {
  const apiKey = await getApiKey();
  if (query.length <= 3) {
    throw new Error("Query too short");
  }
  const options = {
    method: "GET",
    headers: { authorization: `Bearer ${apiKey.access_token}` },
    url: `https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/users`,
    params: { q: `${field}:"${query}"`, search_engine: "v3" },
  };
  console.log("querying " + query);
  const users = await axios
    .request<_.UserData[]>(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return Promise.reject(error);
    });
  return users
}

type Evento = typeof event.$inferSelect;

export async function getCurrentUsersEvents(
  userID: string | undefined,
): Promise<Evento[]> {
  if (userID == undefined) return [];

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

export async function postEvent(targetEvent: typeof event.$inferInsert) {
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
    .returning({ id: invitation.id });
  if (newInvitation[0]) {
    console.log(newInvitation);
    return newInvitation[0];
  } else {
    return false;
  }
}

export async function postResponse(
  targetResponse: typeof response.$inferInsert,
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

export async function getInvitations(eventId: string): Promise<typeof invitation.$inferSelect[]> {
  //* RETURNS ALL INVITATIONS FOR A GIVEN EVENT */
  const invitations = await db.query.invitation.findMany({
    where: eq(invitation.event_id, eventId),
  });
  return invitations;
}

export async function getResponses(eventId: string): Promise<typeof response.$inferSelect[]> {
  //* RETURNS ALL RESPONSES FOR A GIVEN EVENT */
  const responses = await db.query.response.findMany({
    where: eq(response.event_id, eventId),
  });
  return responses;
}

export async function deleteInvitation(invitationId: string): Promise<string | undefined> {
  const deletedInvitation = await db.delete(invitation).where(eq(invitation.id, invitationId)).returning({ inviteeId: invitation.invitee_id })
  if (deletedInvitation[0]) {
    return deletedInvitation[0].inviteeId;
  }else{
    return undefined
  }
}