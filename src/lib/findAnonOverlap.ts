import type { anon_response } from "~/server/db/schema";

type Schedule = { start: Date; end: Date };

export function findAnonOverlap(
  schedules: (typeof anon_response.$inferSelect)[],
  attendees: number,
) {
  if (!schedules) return [];

  // FIND ALL DIFFERENT USERS WITHIN THE RESPONSES FOR ANON EVENTS

  // Attendees is the number of people attending the event
  // A schedule must have the same amount of different users as the attendees to be considered overlapping

  const eventsResponses = schedules;


  eventsResponses.sort((a, b) => {
    if (a.start_time && b.start_time) {
      return a.start_time.getTime() - b.start_time.getTime();
    } else {
      return 1;
    }
  });

  const differentUsers = new Set<string>();
  eventsResponses.forEach((schedule) => {
    differentUsers.add(schedule.participant_id);
  });

  const result: Schedule[] = [];
  const activeIntervals = new Map<string, Schedule>();
  let currentOverlap: Schedule | null = null;

  for (const { start_time, end_time, participant_id } of eventsResponses) {
    activeIntervals.set(participant_id, {
      start: start_time ?? new Date(),
      end: end_time ?? new Date(),
    });
    if (
      activeIntervals.size === differentUsers.size &&
      activeIntervals.size === attendees
    ) {
      const maxStart = new Date(
        Math.max(
          ...Array.from(activeIntervals.values()).map((i) => i.start.getTime()),
        ),
      );
      const minEnd = new Date(
        Math.min(
          ...Array.from(activeIntervals.values()).map((i) => i.end.getTime()),
        ),
      );

      if (maxStart <= minEnd) {
        if (currentOverlap && currentOverlap.end >= maxStart) {
          currentOverlap.end = minEnd;
        } else {
          if (currentOverlap) {
            result.push(currentOverlap);
          }
          currentOverlap = { start: maxStart, end: minEnd };
        }
      }
    }
  }

  if (currentOverlap) {
    result.push(currentOverlap);
  }

  return result;
}
