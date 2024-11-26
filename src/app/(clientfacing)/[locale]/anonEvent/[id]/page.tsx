import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "~/server/db";
import { anon_event } from "~/server/db/schema";
import DateChanger from "./dateChanger";
import ScheduleInput from "./scheduleInput";
import ParticipantOptions from "./participantOptions";
import ScheduleList from "./scheduleList";

export default async function AnonEvent({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const t = await getTranslations("AnonEventPage");
  const eventQuery = await db.query.anon_event.findFirst({
    where: eq(anon_event.code, id),
  });

  if (eventQuery) {
    return (
      <div className="mb-16 w-screen px-2 py-4 md:px-6 md:py-8 lg:px-12">
        <div className="flex-col gap-4">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <h2 className="text-2xl font-light">{id}</h2>
        </div>
        <DateChanger eventCode={id} from={eventQuery.from} to={eventQuery.to} />
        <ParticipantOptions eventId={eventQuery.id} eventCode={id} />
        <ScheduleList eventId={eventQuery.id} eventFrom={eventQuery.from} eventTo={eventQuery.to} />
      </div>
    );
  } else if (!eventQuery) {
    return (
      <div className="flex h-screen w-screen justify-center">
        <p className="py-24">{t("notFound")}</p>
      </div>
    );
  }
}
