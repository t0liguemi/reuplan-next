"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDebounce } from "use-debounce";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserQuery from "./invitationQuery";
import { atom,useAtom, useAtomValue, useSetAtom } from "jotai";
import { PlusIcon } from "lucide-react";
import type { event as eventType } from "~/server/db/schema";
export const invitationDialogOpen = atom(false)
export const queryValue = atom("")

export default function InvitationForm(props: { eventId: string, event: typeof eventType.$inferSelect }) {
  const [isOpen, setIsOpen] = useAtom(invitationDialogOpen);
  const FormSchema = z.object({
    email: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleSubmit(){
    form.setValue("email","");
  }
  const liveEmail = form.watch("email");
  const debouncedEmail = useDebounce(liveEmail, 400)[0];

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button id="invite-button" className="sm:text-xl text-lg">Send new invite <PlusIcon className="ml-2 h-5 w-5" /></Button>
        </DialogTrigger>
        <DialogContent aria-describedby="invite-modal" className="bg-background/60 dark:bg-muted/20 backdrop-blur-lg">
          <DialogHeader><DialogTitle asChild>
            <p>Create new invitation</p>
          </DialogTitle>
          <DialogDescription>
            Invite a user to the event. This user will be able to reject or accept the invitation by adding a response.
            This user muser be registered in ReuPlan to be able to receive an invitation.
          </DialogDescription></DialogHeader>
          
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="invitee's email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <UserQuery userEmail={debouncedEmail} eventId={props.eventId} event={props.event} /> 
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
