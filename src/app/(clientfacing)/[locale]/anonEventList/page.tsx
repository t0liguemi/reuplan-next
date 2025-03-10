"use server";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { Link } from "~/i18n/routing";
import { db } from "~/server/db";
export default async function AnonEventListPage() {
  const session = await auth();
  if (!session?.user.isAdmin) {
    redirect("/");
  }
  const events = await db.query.anon_event.findMany();

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Anon Event List</h1>
      <div className="flex flex-row flex-wrap gap-2 p-4">
        {events.map((event) => (
          <Link
            href={`/anonEvent/${event.code}`}
            key={event.id}
            className="text-md rounded-xl border-2 border-border bg-popover px-4 py-2 hover:border-primary hover:bg-accent"
          >
            {event.code}
          </Link>
        ))}
      </div>
    </div>
  );
}
