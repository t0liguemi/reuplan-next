"use server";
import { Resend } from "resend";
import EmailTemplate from "~/components/invitation-mail-template";
import { env } from "~/env";
import { event as eventSchema, users } from "~/server/db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
        react: EmailTemplate({ event: event, user: user, host: host }),
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
