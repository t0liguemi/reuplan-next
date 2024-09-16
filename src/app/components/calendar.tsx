import { addDays, format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import React from "react";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { notificationAtom } from "~/app/(clientfacing)/[locale]/events/[id]/(eventComponents)/responses";
import { useTranslations } from "next-intl";

type schedule = { start: Date; end: Date };

export default function CalendarResults(props: {
  start: Date;
  schedules: schedule[];
}) {
  //receives data for the schedules within a day and displays them in a calendar
  const [wasNotified, setNotification] = useAtom(notificationAtom);
  const [timesRendered, setTimesRendered] = React.useState<number>(0);
  const { schedules } = props;
  const start = new Date(props.start.setHours(0, 0, 0, 0));
  const t = useTranslations("EventPage")

  function getPercentualTime(targetTime: Date) {
    //calculates the percentage of the day that time corresponds to, where dayStart is 0 and dayStart+24h is 100}
    const dayEnd = addDays(start, 1);
    const percentualTime =
      (targetTime.getTime() - start.getTime()) /
      (dayEnd.getTime() - start.getTime());
    return Math.round(percentualTime * 100);
  }

  function calculateHeight(end:Date, start:Date):number{
    const height = (getPercentualTime(end) - getPercentualTime(start)) * 5;
    if (height < 20 && !wasNotified && timesRendered === 0) {
      setNotification(true);
      toast(t("calendarToast"));
      setTimesRendered(timesRendered+1);
    }
    return height;
  }

  return (
    <div className="flex flex-col">
      <p className="text-ellipsis text-center text-xs font-light my-1">
        {format(start, "E dd/MM/y")}
      </p>
      <div className="relative h-[500px] w-[100px] rounded-md bg-zinc-300 dark:bg-zinc-800 my-1 border-2 border-card">
        {schedules.map((interval) =>
          calculateHeight(interval.end, interval.start) >= 20 
          ? (
            <div
              key={interval.start.toString()}
              style={{ top: `${getPercentualTime(interval.start)}%` }}
              className="absolute left-0 w-full bg-success text-center text-xs text-success-foreground hover:bg-success/80"
            >
              <div
                className="text-xs py-[0.1rem]"
                style={{
                  height: `${calculateHeight(interval.end,interval.start)}px`,
                }}
              >
                <span>
                  {format(interval.start, "HH:mm")} -{" "}
                  {format(interval.end, "HH:mm")}
                </span>
              </div>
            </div>
          ) : (<Popover key={interval.start.toString()}>
              <PopoverTrigger asChild>
                <div
                className="absolute left-0 bg-success hover:bg-success-light"
                  style={{
                    width: "100%",
                    top: `${getPercentualTime(interval.start)*5}px`,
                    height: `${(getPercentualTime(interval.end) - getPercentualTime(interval.start)) * 5}px`,
                  }}
                ></div>
              </PopoverTrigger>
              <PopoverContent className="p-2 backdrop-blur-md bg-background/30 w-fit">
                <div className="text-sm text-foreground w-fit">
                  {format(interval.start, "HH:mm")}{" - "}
                  {format(interval.end, "HH:mm")}
                </div>
              </PopoverContent>
            </Popover>
          ),
        )}
      </div>
    </div>
  );
}
