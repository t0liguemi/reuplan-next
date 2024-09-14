"use server";
import { Resend } from "resend";
import { env } from "~/env";
import { event as eventSchema, users } from "~/server/db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import ReuPlanInvitationMail from "~/components/reuplan-invitation";

const resend = new Resend(env.RESEND_API_KEY);

export default async function sendInvitationEmail(
  userId: string,
  eventId: string,
  hostId: string,
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  const event = await db.query.event.findFirst({
    where: eq(eventSchema.id, eventId),
  });
  const host = await db.query.users.findFirst({
    where: eq(users.id, hostId),
  });

  try {
    if (user && event && host) {
      
      const { data, error } = await resend.emails.send({
        from: "noreply <noreply@reuplan.lol>",
        to: [user.email ?? ""],
        subject: "Invitation to event in ReuPlan",
        react: 
          ReuPlanInvitationMail ({
            eventName:event.name,
            inviteLink:"https://reuplan.lol/events/" + event.id,
            invitedByEmail:host.email ?? undefined,
            invitedByUsername:host.nickname ?? host.name,
            invitedByImage:host.image ?? undefined,
            username:user.nickname ?? user.name,
            userImage:user.image ?? undefined,
            eventDescription:event.description ?? undefined
          })
      });

      if (error) {
        console.log(error);
      }
      return data
    }
  } catch (error) {
    console.log(error);
  }
}
