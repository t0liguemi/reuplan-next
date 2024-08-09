"use client";
type scheduleObject = {
  id: number;
  user_id: number;
  event_id: number;
  start: [number,number,number,number,number];
  end: [number,number,number,number,number];
};
import * as set from "../lib/setPolyfill"

export default function CalendarResults(props: {
  user_id: number;
  schedules: scheduleObject[];
}) {
  type scheduleTimes = [number, number];

  let schedulesSet = new Set<scheduleTimes>();

  function scheduleToSet(schedule: scheduleObject, user_id: number): void {
    if (schedule.user_id !== user_id) {
      return;
    }
    const setStart = new Date(schedule.start[0], schedule.start[1], schedule.start[2], schedule.start[3], schedule.start[4]);
    const setEnd = new Date(schedule.end[0], schedule.end[1], schedule.end[2], schedule.end[3], schedule.end[4]);
    while (true) {
      const times : [number, number] = [setStart.getHours(), setStart.getMinutes()];
      schedulesSet = set.addUnique(schedulesSet, times);
      setStart.setMinutes(setStart.getMinutes() + 30);
      if (setStart > setEnd) {
        break;
      }
    }


  }

  function turnSchedulesIntoSets(
    schedules: scheduleObject[],
    user_id: number,
  ): void {
    for (const schedule of schedules) {
      scheduleToSet(schedule, user_id);
    }
  }

  turnSchedulesIntoSets(props.schedules, props.user_id);
  const schedulesArray = Array.from(schedulesSet);


  return  (
    <div className="flex w-max flex-col items-center justify-center font-mono text-lg">
      <h2>Schedules for user {props.user_id}</h2>
      <ul>
        {schedulesArray.map(([s, e], i) => (
          <li key={i}>
            {s}:{e == 0 ? "00" : e}
          </li>
        ))}
      </ul>
    </div>
  ) 

}
