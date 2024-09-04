import Link from "next/link";
import { Button } from "~/components/ui/button";
import EventList from "./eventList";
import { auth } from "auth";
import { signIn } from "auth";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const session = await auth();

  if (session) {
    return (
      <div className="flex flex-col px-4 py-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <h1 className="my-4 text-4xl font-extrabold">Events</h1>
          {session?.user?.isAdmin && (
            <Link href="/events/admin_all" className="my-2">
              <Button>Events by user</Button>
            </Link>
          )}
          <Link href="/events/create" className="my-2">
            {" "}
            <Button variant={"success"} className="hover:glowing">
              New Event
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
