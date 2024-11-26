"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, setDefaultOptions } from "date-fns";
import { de, enGB, es } from "date-fns/locale";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { revalidatePath } from "next/cache";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
    Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { editAnonEvent, revalidateFromServer } from "~/server/actions";

const FormSchema = z.object({
  from: z.date(),
  to: z.date(),
});

export default function DateChanger({
  eventCode,
  from,
  to,
}: {
  eventCode: string;
  from: Date;
  to: Date;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      from: from,
      to: to,
    },
  });
  const t = useTranslations("AnonEventPage");
  const currentLocale = useLocale();
  setDefaultOptions({
    locale: currentLocale === "es" ? es : currentLocale === "en" ? enGB : de,
  });

  async function handleAnonUpdate(data: z.infer<typeof FormSchema>) {
    // toast(format(data.from, "PPPP") + " - " + format(data.to, "PPPP"));
    const editedEvent = await editAnonEvent(eventCode, data.from, data.to);
    if (editedEvent) {
      toast.success(t("editSuccessToast"));
      await revalidateFromServer("/anonEvent/"+eventCode);
    }else{
      toast.error(t("editErrorToast"));

    }
  }

  return (
    <div>
      <Drawer>
        <DrawerTrigger className="flex flex-row gap-2 items-center" asChild>
          <div>{t("from")}: {format(from, "PPPP")} - {t("to")}: {format(to, "PPPP")}<Button>Modificar</Button></div>
        </DrawerTrigger>
        <DrawerContent className="bg-background/60 dark:bg-muted/30 backdrop-blur-lg flex flex-col gap-2 justify-center items-center">

            <DrawerTitle>{t("dateChangeTitle")}</DrawerTitle>
            <DrawerDescription>{t("dateChangeDescription")}</DrawerDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAnonUpdate)} className="flex flex-col gap-2 justify-center items-center py-6"><div className="flex flex-row gap-6">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem className="flex flex-row gap-2 items-baseline">
                    <FormLabel>{t("from")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          className="hover:cursor-pointer"
                          value={format(field.value, "eee dd/MM/y")}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
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
                  <FormItem className="flex flex-row gap-2 items-baseline">
                    <FormLabel>{t("to")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          className="hover:cursor-pointer"
                          value={format(field.value, "eee dd/MM/y")}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
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
              /></div>
              <Button variant="success" type="submit">{t("submit")}</Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
