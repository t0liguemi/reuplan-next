import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { db } from "~/server/db";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default withPageAuthRequired(
  async function page() {
    const events = await db.query.api_evento.findMany();

    return (
      <div className="container flex flex-col px-12 py-4">
        <div className="flex gap-4 items-center">
          <h1 className="my-4 text-4xl font-extrabold">Events</h1>
          <Link href="/events/own" className="my-2"><Button>Ir a eventos por usuario</Button></Link>
          <Link href="/events/create" className="my-2"> <Button variant={"success"}>Crear evento</Button> </Link>
        </div>
        <div className="flex flex-col gap-4">
          {events.map((event, index) => (
            <Link
              href={`/events/${event.id}`}
              key={index}
              className="flex flex-row justify-between rounded-md border-2 border-black p-4 hover:bg-slate-200 hover:border-primary"
            >
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{event.name}</h2>
                <p className="text-sm">{event.descripcion}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">
                  {event.inicio} al {event.final}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
  { returnTo: "/" },
);
