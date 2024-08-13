"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDebounce } from "use-debounce";
import {
  Dialog,
  DialogContent,
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

export const invitationDialogOpen = atom(false)
export const queryValue = atom("")

export default function InvitationForm(props: { eventId: string }) {
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
          <Button>Invite</Button>
        </DialogTrigger>
        <DialogContent aria-describedby="invite-modal">
          <DialogTitle asChild>
            <p>Invite a user: {debouncedEmail}</p>
          </DialogTitle>
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
                    <FormDescription>
                      This user must be registered in ReuPlan.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <UserQuery userEmail={debouncedEmail} eventId={props.eventId} /> 
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
