import { db } from "~/server/db";
import React from "react";
import UserList from "./userList";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getUsers } from "~/server/actions";


export default async function OwnEventsPage() {


  const users = await getUsers();

  return (
    <div className="my-4 flex flex-col px-12">
      <div className="flex gap-4 my-4">
        <h1 className="text-4xl font-extrabold">Own Events</h1>
        <Link href="/events/"><Button>Back to Events</Button></Link>
      </div>
        <UserList users={users} />
    </div>
  );
}
