"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function MainActionButtons(){
    return (
        <div className="flex gap-2 flex-wrap justify-center items-center sm:gap-4">
        <Link href="/events" className="my-2">
          <Button className="text-2xl px-8 py-6 font-light">My Events</Button>
        </Link>
        <Link href="/events/create" className="my-2">
          <Button variant={"success"} className="text-2xl px-8 py-6 font-light">New Event</Button>
        </Link>
        </div>
    )
}