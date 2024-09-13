import type { event as eventType } from "~/server/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { PopoverClose } from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Slider } from "~/components/ui/slider";
import { deleteEvent, editEvent, revalidateFromServer } from "~/server/actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "~/components/ui/label";
import { useTranslations } from "next-intl";


const FormSchema = z.object({
    name: z.string().min(4, { message: "Name is too short" }).max(100),
    description: z.string().optional(),
    location: z.string().optional(),
    from: z.date(),
    to: z.date(),
    maps_query: z.boolean(),
    privacy_level: z.number().default(3),
  });


export default function EditEventSheet(props: {
  event: typeof eventType.$inferSelect;
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteInputValue, setDeleteInputValue] = React.useState(false);
  const { event } = props;
  const t = useTranslations("EventPage")
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: event.name,
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      from: event.from,
      to: event.to,
      maps_query: event.maps_query ?? undefined,
      privacy_level: event.privacy_level,
    },
  });

  async function handleSubmit() {
   const editedEvent = await editEvent({
    id: event.id,
    name: form.getValues("name"),
    description: form.getValues("description") ?? null,
    location: form.getValues("location") ?? null,
    from: form.getValues("from"),
    to: form.getValues("to"),
    maps_query: form.getValues("maps_query") ?? null,
    privacy_level: form.getValues("privacy_level"),
    created_at: event.created_at,
    updated_at: new Date(),
    host_id: event.host_id,
   });
    if (editedEvent) {
      toast.success(t("editSuccessToast"));
      await revalidateFromServer("/events/"+event.id);
    }else{
      toast.error(t("editErrorToast"));
    }
  }

  async function handleDeleteEvent(id: string) {
    const deletedEvent = await deleteEvent(id);
    if (deletedEvent) {
      toast.success(t("deleteSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["userEvents"] });
      await queryClient.invalidateQueries({ queryKey: ["userResponses"] });
      await queryClient.invalidateQueries({ queryKey: ["responses"] });
      await queryClient.invalidateQueries({ queryKey: ["invitations"] });
      await queryClient.invalidateQueries({ queryKey: ["invitees"] });
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/events");
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="sm:px-8 px-4 py-2 sm:text-xl text-md font-light">{t("edit")}</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-2 w-[92vw] sm:max-w-screen-sm bg-background/60 dark:bg-muted/30 backdrop-blur-lg overflow-scroll">
        <SheetHeader>

              <SheetTitle>{t("editingEvent")}: {event.name}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Form {...form} >
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("editSheetNameField")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("from")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          className="hover:cursor-pointer"
                          value={format(field.value, "eee dd/MM/y")}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="">
                          <PopoverClose>
                            {" "}
                            <X className="h-5 w-5" />
                          </PopoverClose>
                        </div>
                        <FormControl>
                          <Calendar
                            {...field}
                            title="From"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </FormControl>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("to")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          className="hover:cursor-pointer"
                          value={format(field.value, "eee dd/MM/y")}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="">
                          <PopoverClose>
                            {" "}
                            <X className="h-5 w-5" />
                          </PopoverClose>
                        </div>
                        <FormControl>
                          <Calendar
                            {...field}
                            title="To"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </FormControl>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="items-bottom flex flex-row gap-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex grow flex-col gap-2">
                    <FormLabel>{t("location")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Location" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maps_query"
                render={({ field }) => (
                  <FormItem className="flex shrink flex-col justify-start gap-2">
                    <FormLabel>{t("mapsSearch")}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
            control={form.control}
            name="privacy_level"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("privacy")}</FormLabel>
                <div className="flex flex-col items-start gap-4">
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full flex-col items-start gap-2">
                      <div className="flex w-full max-w-[800px] justify-between gap-4">
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          {t("privacy0")}
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          {t("privacy1")}
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          {t("privacy2")}
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                            {t("privacy3")}
                        </div>
                      </div>
                      <FormControl>
                        <Slider 
                          value={[field.value]}
                          onValueChange={(e)=>typeof e[0]=="number"?form.setValue("privacy_level",e[0]):form.setValue("privacy_level",0)}
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
                        {form.getValues("privacy_level") === 0
                          ? t("privacy0Description")
                          : form.getValues("privacy_level") === 1
                            ? t("privacy1Description")
                            : form.getValues("privacy_level") === 2
                              ? t("privacy2Description")
                              : t("privacy3Description")}

                      </p>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
              
            )}
          />
          <Button variant="success" type="submit">{t("save")}</Button>
          </form>
        </Form>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
            <Button variant="destructive" className="mt-6 mb-4">{t("deleteEvent")}</Button>
            </DialogTrigger>
              <DialogContent className="bg-background/60 dark:bg-muted/30 backdrop-blur-lg">
                <DialogHeader><DialogTitle>
                  {t("deleteEvent")}
                </DialogTitle>
                <DialogDescription>
                  {t("deleteConfirmation")}
                </DialogDescription></DialogHeader>
                <Label htmlFor="delete-event-input">{t.rich("captcha",{strong:(children)=> <strong>{children}</strong>})}</Label>
                <Input id="delete-event-input" onChange={(e)=>e.target.value==="delete event permanently"?setDeleteInputValue(true):setDeleteInputValue(false)} />
                  <Button disabled={!deleteInputValue} variant="destructive" onClick={()=>handleDeleteEvent(event.id)}>{t("deleteEvent")}</Button> 
              </DialogContent>

            </Dialog>


      </SheetContent>
    </Sheet>
  );
}
