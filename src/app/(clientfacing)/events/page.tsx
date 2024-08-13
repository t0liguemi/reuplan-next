import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { db } from "~/server/db";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { DateRange } from "react-day-picker";
import { getUser, getUsers } from "~/server/actions";

export default withPageAuthRequired(
  async function page() {
    const users = await getUsers()
    const events = await db.query.event.findMany();
    async function findUserName(userId:string){
      const user = users.find((user) => user.user_id === userId);
      return user?.username?? user?.email;
    }
    
    return (
      <div className="container flex flex-col px-12 py-4">
        <div className="flex items-center gap-4">
          <h1 className="my-4 text-4xl font-extrabold">Events</h1>
          <Link href="/events/own" className="my-2">
            <Button>Ir a eventos por usuario</Button>
          </Link>
          <Link href="/events/create" className="my-2">
            {" "}
            <Button variant={"success"}>Crear evento</Button>{" "}
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {events.length > 0
            ? events.map((event, index) => {return (
                <Link
                  href={`/events/${event.id}`}
                  key={index}
                  className="flex flex-row justify-between rounded-md border-2 border-black p-4 hover:border-primary hover:bg-slate-200"
                >
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">{event.name}</h2>
                    <small className="text-sm">Host: {findUserName(event.host_id)}</small>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">{new Date(event.from).toLocaleDateString()} - {new Date(event.to).toLocaleDateString()}</p>
                  </div>
                </Link>
              )})
            : null}
        </div>
      </div>
    );
  },
  { returnTo: "/" },
);
