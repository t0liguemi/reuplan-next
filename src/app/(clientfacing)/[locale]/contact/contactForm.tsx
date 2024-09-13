"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";  
import { Textarea } from "~/components/ui/textarea";
import React from "react";
import { toast } from "sonner";
import sendContactMail from "~/server/send-contact-mail";
import { useTranslations } from "next-intl";



export default function ContactForm(props: { name?: string; email?: string }) {

  const t = useTranslations("ContactPage");
  const contactSchema = z.object({
    name: z.string().min(2, { message: t("formErrorName") }),
    subject: z.string().min(5, { message: t("formErrorSubject") }),
    message: z.string().min(20, {
      message: t("formErrorMessage"),
    }),
    email: z.string().email({ message: t("formErrorEmail") }),
  });

  const [isCorrect, setIsCorrect] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const checkMessage = "send contact message";
  const { name, email } = props;
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: name ?? "",
      email: email ?? "",
    },
  });

  async function submitMessage(data: z.infer<typeof contactSchema>) {
    const email = await sendContactMail(
      data.name,
      data.email,
      data.subject,
      data.message,
    );
    if (email) {
      toast(t("successToast"));
      setIsOpen(false);
    } else {
      toast(t("errorToast"));
    }
  }

  async function checkSubmition() {
    setIsOpen(true);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(checkSubmition)}
      >
        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("subject")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("message")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t("send")}
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit contact form</DialogTitle>
              <DialogDescription className="select-none">
                {t.rich("checkMessage", {
                  strong: (chunk) => <strong>{chunk}</strong>,
                })}
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              onChange={(e) =>
                e.target.value === checkMessage
                  ? setIsCorrect(true)
                  : setIsCorrect(false)
              }
            />
            <Button
              disabled={!isCorrect}
              onClick={() => submitMessage(form.getValues())}
            >
              Send
            </Button>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
