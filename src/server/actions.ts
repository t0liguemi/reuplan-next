"use server"
import { env } from "~/env";
import axios from "axios";
import type * as _ from "auth0";
import {db} from "./db/index"
import { eq, or } from "drizzle-orm";
import { api_evento, api_invitacion } from "drizzle/schema";
import { api_eventoRelations, api_invitacionRelations } from "drizzle/relations";

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
      return response.data
    })
    .catch(function (error) {
      console.error(error);
      return Promise.reject(error);
    });

  return data;
}

export async function getUsers(): Promise<_.UserData[]> {
  const apiKey = await getApiKey();

  const options = {
    method: "GET",
    url: "https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/users",
    headers: { authorization: `Bearer ${apiKey.access_token}`},
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
    headers:{ accept: 'application/json', authorization: `Bearer ${apiKey.access_token}` },
    url:`https://dev-wnu4n5y3632k0xxd.us.auth0.com/api/v2/users/${id}/roles`,
    redirect: "follow"
  }
  const roles = await axios.request<_.Role[]>(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return Promise.reject(error);
    });

    return roles;
}

type Evento = typeof api_evento.$inferSelect;

export async function getCurrentUsersEvents(userID: number):Promise<Evento[]>{
  const receivedInvitations = await db.query.api_invitacion.findMany({
    where:(api_invitacion , {eq}) => (eq(api_invitacion.invitado_id,userID))}
  )
  const invitedEvents:Evento[] = []
  for (const invitation of receivedInvitations){
    const event = await db.query.api_evento.findFirst({where:eq(api_evento.id,invitation.evento_id)})
    if (event){invitedEvents.push(event)}
  }

  const ownEvents = await db.query.api_evento.findMany({where:eq(api_evento.organizador_id,userID)})
  ownEvents.forEach(event => {
    if(!invitedEvents.some(invitedEvent => invitedEvent.id === event.id)){
      invitedEvents.push(event)
    }
  })
  return invitedEvents;
}
