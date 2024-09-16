"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { updateUserNames } from "~/server/actions";

const NameSchema = z.object({
  name: z
    .string()
    .min(6, { message: "Must be at least 6 characters" })
    .max(100),
  nickname: z.string().max(100).optional(),
  show_email: z.boolean(),
});

export default function AccountForm(user: {
  passwordChangeable: boolean;
  id: string;
  nickname?: string;
  name: string;
  show_email: boolean;
  email: string;
}) {
  const t = useTranslations("AccountPage");
  const nameForm = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      nickname: user.nickname ?? "",
      name: user.name,
      show_email: user.show_email,
    },
  });

  async function handleNameSubmit() {
    const data = await updateUserNames({
      id: user.id,
      nickname: nameForm.getValues("nickname") ?? user.nickname,
      name: nameForm.getValues("name"),
      show_email: nameForm.getValues("show_email"),
    });
    if (data) {
      toast.success(t("updateSuccessToast"));
    } else {
      toast.error(t("updateErrorToast"));
    }
  }

  return (
    <div>
      <Form {...nameForm}>
        <form
          className="flex flex-col gap-6"
          onSubmit={nameForm.handleSubmit(handleNameSubmit)}
        >
          <FormField
            control={nameForm.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nickname")}</FormLabel>
                <FormDescription>{t("nicknameDescription")}</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={nameForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormDescription>{t("nameDescription")}</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={nameForm.control}
            name="show_email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>{t("showEmail")}</FormLabel>
                <div className="flex gap-4 flex-wrap">
                  <FormDescription className="max-w-screen-sm text-wrap">
                    {t("showEmailDescription")}
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <Button variant="success" type="submit">
            {t("saveButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
