import {Link} from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import EventList from "./eventList";
import { auth } from "auth";
import { signIn } from "auth";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const session = await auth();
  const t = await getTranslations("EventListPage")

  if (session) {
    return (
      <div className="flex flex-col px-4 py-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <h1 className="my-4 text-4xl font-extrabold">{t("title")}</h1>
          {session?.user?.isAdmin && (
            <Link href="/events/admin_all" className="my-2">
              <Button>{t("eventsByUser")}</Button>
            </Link>
          )}
          <Link href="/events/create" className="my-2">
            {" "}
            <Button variant={"success"} className="hover:glowing">
              {t("newEvent")}
            </Button>{" "}
          </Link>
        </div>

        <EventList userID={session.user.id} />
      </div>
    );
  } else {
    await signIn();
  }
}
