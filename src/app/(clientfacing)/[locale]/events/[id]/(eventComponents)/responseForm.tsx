import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  addHours,
  addMinutes,
  format,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  setDate,
  setDefaultOptions,
  setMonth,
  setYear,
} from "date-fns";
import type { event } from "~/server/db/schema";
import { TimePickerInput } from "~/components/ui/time-picker-input";
import { postResponse } from "~/server/actions";
import { useQueryClient } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { de, enGB, es } from "date-fns/locale";

export default function ResponseInput(props: {
  currentEvent: typeof event.$inferSelect;
}) {
  const currentLocale = useLocale();
  setDefaultOptions({ locale: currentLocale==="es" ? es : currentLocale==="en" ? enGB : de })
  const t = useTranslations("EventPage");
  const { currentEvent } = props;
  const session = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const formSchema = z.object({
    date: z.date(),
    timeStart: z.date(),
    timeEnd: z.date(),
  });

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: currentEvent.from,
      timeStart: currentEvent.from,
      timeEnd: addMinutes(addHours(currentEvent.from, 23), 59),
    },
  });

  async function onSubmit(data: FormSchemaType) {
    setSubmitting(true);
    if (
      getHours(data.timeStart) + getMinutes(data.timeStart) >=
      getHours(data.timeEnd) + getMinutes(data.timeEnd)
    ) {
      toast("End time must be after start time!");
      setSubmitting(false);
      return;
    } else if (session.status != "authenticated") {
      await signIn();
    } else {
      const response = await postResponse({
        event_id: currentEvent.id,
        invitee_id: session.data.user.id,
        date: data.date,
        start_time: data.timeStart,
        end_time: data.timeEnd,
        is_accepted: true,
      });
      if (response) {
        await queryClient.invalidateQueries({
          queryKey: ["responses", currentEvent.id],
        });
        await queryClient.invalidateQueries({
          queryKey: ["userResponses", session.data.user.id],
        });
        toast(t("responseSubmitSuccessToast"));

        setOpen(false);
        setSubmitting(false);
      } else {
        toast(t("responseSubmitErrorToast"));
        setSubmitting(false);
      }
    }
  }

  function handleCalendarSelect(e: Date) {
    form.setValue("date", e);
    const date = form.getValues("date");
    const currentTimeStart = form.getValues("timeStart");
    const currentTimeEnd = form.getValues("timeEnd");
    const correctedStart = setYear(
      setMonth(setDate(currentTimeStart, getDate(date)), getMonth(date)),
      getYear(date),
    );
    const correctedEnd = setYear(
      setMonth(setDate(currentTimeEnd, getDate(date)), getMonth(date)),
      getYear(date),
    );
    form.setValue("timeStart", correctedStart);
    form.setValue("timeEnd", correctedEnd);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="enter-response">{t("enterResponse")}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] min-w-fit overflow-scroll bg-background/60 backdrop-blur-lg dark:bg-muted/20">
        <DialogHeader>
          <DialogTitle>{t("enterResponse")}</DialogTitle>
          <DialogDescription>{t("newResponseDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-center justify-center gap-4 xl:flex-row"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="date"
              defaultValue={new Date()}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl className="border-border-20 rounded-lg border-2">
                    {/* <Button
                      variant="outline"
                      className="w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button> */}

                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => (e ? handleCalendarSelect(e) : null)}
                      fromDate={currentEvent.from}
                      toDate={currentEvent.to}
                      initialFocus
                      defaultMonth={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-row items-center gap-2">
                <p>{t("fromTime")}</p>
                <FormField
                  control={form.control}
                  name="timeStart"
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
                <p>{t("toTime")}</p>
                <FormField
                  control={form.control}
                  name="timeEnd"
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
              <Button type="submit" disabled={submitting}>
                {t("submitSchedule")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
