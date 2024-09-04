import React from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";


export default async function OwnEventsPage() {


  return (
    <div className="my-4 flex flex-col px-12">
      <div className="flex gap-4 my-4">
        <h1 className="text-4xl font-extrabold">All Events</h1>
        <Link href="/events/"><Button>Back to Events</Button></Link>
      </div>
      <h1> Here will be an admin-exclusive view of all events to manage</h1>
    </div>
  );
}
