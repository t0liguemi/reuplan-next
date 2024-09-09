
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import MainActionButtons from "./action";
import { auth } from "auth";
import { getCurrentUsersEvents, getCurrentUserResponses } from "~/server/actions";
import { queryClient } from "./layout";

export default async function HomePage() {
  const session = await auth();

  await queryClient.prefetchQuery({queryKey:["userEvents"], queryFn:() => getCurrentUsersEvents(session?.user?.id??"")})
  await queryClient.prefetchQuery({queryKey:["userResponses"], queryFn:() => getCurrentUserResponses(session?.user?.id??"")})


  return (
    <div className="sm:py-8 py-4 flex flex-col items-center justify-center gap-8 lg:px-12 md:px-8 px-4">
      <div className="flex md:flex-row flex-col  md:items-start md:justify-start items-center  gap-6">
        <div className="flex flex-col max-w-[640px] gap-4 items-start justify-start py-5 text-foreground">
            <div className="text-4xl">
              <span className="font-bold">Welcome to </span>
              <span className="font-extrabold text-primary">Reu</span>
              <span className="text-success font-extrabold">plan</span>
              <span className="font-bold">
                , a minimalist web app with a single focus: Ease meeting planning.
              </span>
            </div>
            <p className="font-bold text-muted-foreground text-2xl">
              With Reuplan you can plan your meetings in record time, without
              having to personally worry about the availability of your
              attendees. Just let each invitee enter their availabilities and
              the app will show the intersection of all availabilities.
            </p>
            {session?.user &&
      <MainActionButtons />}
            <Separator className="w-full" />
            <p className="font-light text-muted-foreground text-xl">
              Based on the core function of the now decadent Doodle app, this app is still in development, it is free of use, but you can contribute or
              pay a subscription (soon) to use it more powerfully and support its maintenance and improvement 🎉.
              <br/><br/>
              Translations coming soon! A lot of features still to be implemented, but it is already usable. Soon I will add a contact form to report bugs or request new features, or just spam me idk

            </p>
        </div>
        <Image
          src="/assets/Calendarios.svg"
          alt="Calendarios"
          width={300}
          height={500}
          className="align-middle svg-contrast"
        />
      </div>
     
    </div>
  );
}
