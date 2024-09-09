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
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import React from "react";
import { toast } from "sonner";
import sendContactMail from "~/server/send-contact-mail";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name too short" }),
  subject: z.string().min(5, { message: "Subject too short" }),
  message: z.string().min(20, {
    message: "Message too short, explain your issue as thoroughly as possible",
  }),
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ContactForm(props: { name?: string; email?: string }) {
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
      toast("Contact form submitted succesfully! 🎉");
      setIsOpen(false);
    } else {
      toast(
        "Error submitting contact form, send an email to merengueconjamon@gmail.com instead",
      );
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
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Email</FormLabel>
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
              <FormLabel>Subject</FormLabel>
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Send
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit contact form</DialogTitle>
              <DialogDescription className="select-none">
                Type <strong>{checkMessage}</strong> to send
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
