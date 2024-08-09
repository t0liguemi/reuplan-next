import React from "react";
import UserSelect from "~/app/components/userSelect";
import Link from "next/link";

type scheduleObject = {
  id: number;
  user_id: number;
  event_id: number;
  start: [number, number, number, number, number];
  end: [number, number, number, number, number];
};

export default function Calendar() {
  const testSchedules: scheduleObject[] = [
    {
      id: 1,
      user_id: 1,
      event_id: 1,
      start: [2024, 6, 23, 8, 0],
      end: [2024, 6, 23, 11, 30],
    },
    {
      id: 2,
      user_id: 2,
      event_id: 1,
      start: [2024, 6, 23, 8, 30],
      end: [2024, 6, 23, 13, 30],
    },
    {
      id: 3,
      user_id: 3,
      event_id: 1,
      start: [2024, 6, 23, 10, 30],
      end: [2024, 6, 23, 22, 0],
    },
    {
      id: 4,
      user_id: 4,
      event_id: 1,
      start: [2024, 6, 23, 8, 0],
      end: [2024, 6, 23, 11, 30],
    },
    {
      id: 5,
      user_id: 5,
      event_id: 1,
      start: [2024, 6, 23, 8, 30],
      end: [2024, 6, 23, 13, 30],
    },
    {
      id: 6,
      user_id: 6,
      event_id: 1,
      start: [2024, 6, 23, 10, 30],
      end: [2024, 6, 23, 22, 0],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-screen">
      <h1 className="my-2 text-4xl font-extrabold">Calendar</h1>
      <Link href={"/"}
      className="my-2 rounded-md border-2 bg-slate-50 px-4 py-2 hover:bg-slate-200 text-xl font-bold border-slate-200 hover:border-white">
        Back
      </Link>
      <UserSelect {...{ testSchedules: testSchedules }} />
    </main>
  );
}
