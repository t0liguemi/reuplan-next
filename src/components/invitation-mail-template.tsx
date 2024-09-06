import ReuPlanInvitationMail from "./reuplan-invitation";
import type { event as eventSchema, users } from "~/server/db/schema";

export default function EmailTemplate(props: {
  user: typeof users.$inferSelect;
  event: typeof eventSchema.$inferSelect;
  host: typeof users.$inferSelect;
}) {
  const { user, event, host } = props;

  return (
    <ReuPlanInvitationMail
      eventName={event.name}
      inviteLink={"https://reuplan.lol/events/" + event.id}
      invitedByEmail={host.email ?? undefined}
      invitedByUsername={host.nickname ?? host.name}
      invitedByImage={host.image ?? undefined}
      username={user.nickname ?? user.name}
      userImage={user.image ?? undefined}
    />
  );
}
