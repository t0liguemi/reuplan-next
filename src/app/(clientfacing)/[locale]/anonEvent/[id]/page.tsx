import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "~/server/db";
import { anon_event } from "~/server/db/schema";
import DateChanger from "./dateChanger";
import ParticipantOptions from "./participantOptions";
import ScheduleList from "./scheduleList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Info } from "lucide-react";
import Copier from "~/app/components/copier";

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
          <div className="flex flex-row gap-2">
            <h2 className="text-2xl font-light">{id}</h2>
            <Popover>
              <div className="flex flex-row gap-2">
                <PopoverTrigger>
                  <Info />
                </PopoverTrigger>{" "}
                <Copier
                  stringToCopy={
                    "https://reuplan.lol/anonEvent/" + eventQuery.code
                  }
                />
              </div>
              <PopoverContent className="min-w-80 max-w-screen bg-background/60 p-4 backdrop-blur-xl text-sm">
                <div>
                  <p>{t("codeTip")}</p>{" "}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DateChanger
          expiresAt={eventQuery.expires_at}
          eventCode={id}
          from={eventQuery.from}
          to={eventQuery.to}
        />
        <ParticipantOptions eventId={eventQuery.id} eventCode={id} />
        <ScheduleList
          eventId={eventQuery.id}
          eventFrom={eventQuery.from}
          eventTo={eventQuery.to}
        />
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
