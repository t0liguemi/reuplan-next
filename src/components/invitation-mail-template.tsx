import { format } from "date-fns";
import ReuPlanInvitationMail from "react-email-starter/emails/reuplan-invitation";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import type { event as eventSchema, users } from "~/server/db/schema";

export default function EmailTemplate(props: {
  user: typeof users.$inferSelect;
  event: typeof eventSchema.$inferSelect;
  host: typeof users.$inferSelect;
}) {
  const { user, event, host } = props;
  console.log(props);

  return (
    <ReuPlanInvitationMail
      eventName={event.name}
      inviteLink={"https://reuplan-next.vercel.app/events/" + event.id}
      invitedByEmail={host.email ?? undefined}
      invitedByUsername={host.nickname ?? host.name}
      invitedByImage={host.image ?? undefined}
      username={user.nickname ?? user.name}
      userImage={user.image ?? undefined}
    />
  );

  if (user && event) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-top flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-border from-[#252221] to-[#040F1A] p-2 text-white">
          <p className="text-xl font-extrabold">
            <span className="text-primary">Reu</span>
            <span className="text-success">plan</span>
          </p>

          <p>
            Hello {user.name}, you have been invited to an event in ReuPlan.
            Please click the link below to set up your account.
          </p>

          <div className="mx-2 flex flex-col gap-1 py-2 text-lg">
            <p>
              <span className="font-extralight">Event Name:</span> {event.name}
            </p>
            <p>
              <span className="font-extralight">Organizer:</span>{" "}
              {host.nickname ?? host.name}
            </p>
            <p>
              <span className="font-extralight">
                From {format(event.from, "EEEE dd/MM/yyyy")} to{" "}
                {format(event.to, "EEEE dd/MM/yyyy")}
              </span>
            </p>
            <p>
              <span className="font-extralight">Location:</span>{" "}
              {event.location}
            </p>
          </div>

          <small>
            Please click the button below to check further details and answer or
            reject the invitation. Remember: to successfully accept the
            invitation, you need to enter an assistance schedule in the
            event&apos;s calendar.
          </small>
          <a href={`https://reuplan-next.vercel.app/events/${event.id}`}>
            <Button variant="outline" className="text-xl font-extrabold">
              <span className="text-primary">Reu</span>
              <span className="text-success">plan</span>
            </Button>
          </a>
        </div>
      </div>
    );
  }
}
