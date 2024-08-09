"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { cn } from "~/lib/utils";

import { Switch } from "~/components/ui/switch";

import { Slider } from "~/components/ui/slider";

const formSchema = z.object({
  name: z.string().min(4, { message: "Name is too short" }).max(100),
  location: z.string().max(100).optional(),
  dateRange: z.object(
    {
      from: z.date({ message: "Date is required" }),
      to: z.date({ message: "Date is required" }),
    },
    { required_error: "Date is required", message: "Date is required" },
  ),
  description: z.optional(z.string().min(0).max(2000)),
  privacyLevel: z.number().int().min(0).max(3),
  mapsQuery: z.boolean(),
});

export default function NewEventPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      privacyLevel: 2,
      mapsQuery: true,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="mb-8 flex flex-col px-4 md:px-12 lg:my-4">
      <div className="my-4 flex gap-4">
        <h1 className="text-4xl font-extrabold">New Event</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="min-h-[6.5em]">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dateRange"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date range</FormLabel>
                  <FormControl>
                    <div className={"grid gap-2"}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mapsQuery"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Maps Search</FormLabel>
                  <div className="flex items-center justify-between">
                    <FormDescription>
                      Search location on Google Maps. Be as precise as possible
                      to ensure the exact place is shown.
                    </FormDescription>

                    <FormControl>
                      <Switch
                        id="location-query"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyLevel"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Privacy</FormLabel>
                <div className="flex flex-col items-start gap-4">
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full flex-col items-start gap-2">
                      <div className="flex w-full max-w-[800px] justify-between gap-4">
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          Event Only
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          # Invites sent
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          Invitees details
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          Attendance
                        </div>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(e)=>typeof e[0]=="number"?form.setValue("privacyLevel",e[0]):form.setValue("privacyLevel",0)}
                          min={0}
                          max={3}
                          step={1}
                          className="w-full max-w-[780px] flex-1"
                        ></Slider>
                      </FormControl>
                    </div>
                  </div>
                  <div className="min-h-[7em]">
                    <div className="max-w-[600px] rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">
                        Your current privacy setting is{" "}
                        <span className="font-medium text-primary">
                          {form.getValues("privacyLevel") === 0
                            ? '"Event Only"'
                            : form.getValues("privacyLevel") === 1
                              ? '"# Invites"'
                              : form.getValues("privacyLevel") === 2
                                ? '"Invitees details"'
                                : form.getValues("privacyLevel") === 3
                                  ? '"Attendance"'
                                  : null}
                        </span>
                        . This means your invitees can{" "}
                        {form.getValues("privacyLevel") === 0
                          ? "see your event, answer to it"
                          : form.getValues("privacyLevel") === 1
                            ? "see your event, answer to it, see how many invitees the event has"
                            : form.getValues("privacyLevel") === 2
                              ? "see your event's details, answer to it, see the details of the invitees"
                              : "see your event, answer it, see every invitees' attendance or rejection"}{" "}
                        and see the calendar results.
                      </p>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
