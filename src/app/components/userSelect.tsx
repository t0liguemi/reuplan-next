"use client";
import React from "react";
import CalendarResults from "./calendar";
type scheduleObject = {
  id: number;
  user_id: number;
  event_id: number;
  start: [number, number, number, number, number];
  end: [number, number, number, number, number];
};

export default function UserSelect({
  testSchedules,
}: {
  testSchedules: scheduleObject[];
}) {
  const [user_id, setUserId] = React.useState<number>(1);

  function findDifferentUsers(schedules: scheduleObject[]): number[] {
    const userSet = new Set<number>();
    for (const schedule of schedules) {
      userSet.add(schedule.user_id);
    }
    return Array.from(userSet);
  }

  const users = findDifferentUsers(testSchedules);

  return (
    <div className="my-5 flex items-center justify-center gap-5 py-5 w-full">
      <div className="flex flex-col items-center justify-center rounded-md border-2 border-black bg-gradient-to-tr from-zinc-50 to-zinc-300 p-2 px-5">
        <select
          className="my-2 rounded-md border-2 border-black p-2 selection:border-orange-500 focus:border-orange-500"
          onChange={(e) => setUserId(parseInt(e.target.value))}
        >
          {users.map((user) => (
            <option value={user} key={user}>
             {user}
            </option>
          ))}
        </select>
        <div className="max-h-96 overflow-scroll">
          <CalendarResults {...{ user_id, schedules: testSchedules }} />
        </div>
      </div>
      <div className={`w-8/12 my-5 flex flex-nowrap gap-4 overflow-auto bg-white p-5 rounded-md`}>
        {users.map((user) => (
          <div
            key={"results" + user}
            className="max-h-96 min-w-fit overflow-scroll rounded-md border-2 border-black bg-gradient-to-tr from-zinc-50 to-zinc-300 p-2 px-5"
          >
            <CalendarResults {...{ user_id: user, schedules: testSchedules }} />
          </div>
        ))}
      </div>
    </div>
  );
}
