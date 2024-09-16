import { Separator } from "~/components/ui/separator";

import AccountForm from "./accountForm";

import { auth, signIn } from "auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getTranslations } from "next-intl/server";

export default async function AccountPage() {
  const session = await auth();
  const t = await getTranslations("AccountPage");
  
  if (session?.user) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-4 sm:py-8 md:px-8 lg:px-12">
        <div className="flex flex-row gap-4 items-center justify-center flex-wrap">
            <h1 className="text-4xl font-extrabold">{t("title")}</h1>
            <div className="flex flex-row gap-2 items-center text-3xl font-extralight">
              <Avatar><AvatarImage src={session.user.image??undefined} className="border-primary"/>
              <AvatarFallback></AvatarFallback></Avatar><h4>{session.user.email}</h4>
            </div>
        </div>
        <Separator orientation="horizontal" className="my-4 w-full" />
        <AccountForm
          show_email={session.user.showEmail}
          passwordChangeable={false}
          id={session.user.id}
          nickname={session.user.nickname}
          name={session.user.name}
          email={session.user.email}
        />
      </div>
    );
  } else {
    await signIn()

  }
}
