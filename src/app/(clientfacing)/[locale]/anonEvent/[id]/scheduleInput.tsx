"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  addHours,
  addMinutes,
  format,
  getDate,
  getMonth,
  getYear,
  setDate,
  setDefaultOptions,
  setMonth,
  setYear,
} from "date-fns";
import { de, enGB, es } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { ClockIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { TimePickerInput } from "~/components/ui/time-picker-input";
import { cn } from "~/lib/utils";
import { createAnonSchedule } from "~/server/actions";
import { currentParticipantID } from "./participantOptions";
import { useState } from "react";

const formSchema = z.object({
  date: z.date(),
  from: z.date(),
  to: z.date(),
});

export default function ScheduleInput({
  code,
  eventFrom,
  eventTo,
}: {
  code: string;
  eventFrom: Date;
  eventTo: Date;
}) {
  const t = useTranslations("AnonEventPage");
  const currentLocale = useLocale();
  const currentUserID = useAtomValue(currentParticipantID)
  const [isOpen, setIsOpen] = useState(false);
  setDefaultOptions({
    locale: currentLocale === "es" ? es : currentLocale === "en" ? enGB : de,
  });
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: eventFrom,
      from: eventFrom,
      to: addMinutes(addHours(eventFrom, 23), 59),
    },
  });

  async function handleNewSchedule(data: z.infer<typeof formSchema>) {
    const newSchedule = await createAnonSchedule(
      code,
      data.date,
      data.from,
      data.to,
      currentUserID,
    );
    if (newSchedule) {
      toast.success(t("newScheduleSuccessToast"));
      await queryClient.invalidateQueries({
        queryKey: ["anonResponses", code],
      });
      await queryClient.invalidateQueries({
        queryKey: [code, "anonEventSchedules"],
      });
    } else {
      toast.error(t("newScheduleErrorToast"));
    }
    setIsOpen(false);
  }

  function handleCalendarSelect(e: Date) {
    form.setValue("date", e);
    const date = form.getValues("date");
    const currentTimeStart = form.getValues("from");
    const currentTimeEnd = form.getValues("to");
    const correctedStart = setYear(
      setMonth(setDate(currentTimeStart, getDate(date)), getMonth(date)),
      getYear(date),
    );
    const correctedEnd = setYear(
      setMonth(setDate(currentTimeEnd, getDate(date)), getMonth(date)),
      getYear(date),
    );
    form.setValue("from", correctedStart);
    form.setValue("to", correctedEnd);
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>{t("newScheduleTitle")}</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background/60 dark:bg-muted/40 backdrop-blur-lg">
        <DrawerHeader>
          <DrawerTitle className="w-full text-center">{t("newScheduleTitle")}</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            className="my-6 flex flex-col items-center"
            onSubmit={form.handleSubmit(handleNewSchedule)}
          >
            <FormField
              control={form.control}
              name="date"
              defaultValue={eventFrom}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Calendar
                      {...field}
                      title="Date"
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => (e ? handleCalendarSelect(e) : null)}
                      fromDate={eventFrom}
                      toDate={eventTo}
                      initialFocus
                      defaultMonth={field.value}
                      locale={
                        currentLocale === "es"
                          ? es
                          : currentLocale === "en"
                            ? enGB
                            : de
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-row items-baseline gap-4">
              <div className="flex flex-row items-baseline gap-1">
                <p className="text-nowrap">{t("fromTime")}</p>
                <FormField
                  control={form.control}
                  name="from"
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[100px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <ClockIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "HH:mm")
                              ) : (
                                <span>{t("fromTime")}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="flex w-auto flex-row items-center gap-1 bg-muted/40 p-2">
                          <TimePickerInput
                            picker="hours"
                            date={field.value}
                            setDate={field.onChange}
                          />
                          :
                          <TimePickerInput
                            picker="minutes"
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row items-baseline gap-1">
                <p className="text-nowrap">{t("toTime")}</p>
                <FormField
                  control={form.control}
                  name="to"
                  defaultValue={addHours(new Date(), 2)}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[100px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <ClockIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "HH:mm")
                              ) : (
                                <span>{t("toTime")}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="flex w-auto flex-row items-center gap-1 bg-muted/40 p-2">
                          <TimePickerInput
                            picker="hours"
                            date={field.value}
                            setDate={field.onChange}
                          />

                          <TimePickerInput
                            picker="minutes"
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
           
            </div>
            <Button type="submit" className="my-2" disabled={currentUserID?false:true}>
                {t("submit")}
              </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
