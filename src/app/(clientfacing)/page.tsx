
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
              <span className="font-bold">Bienvenidx a </span>
              <span className="font-extrabold text-primary">Reu</span>
              <span className="text-success font-extrabold">Plan</span>
              <span className="font-bold">
                , una aplicación web minimalista con un único propósito: Facilitar
                los encuentros.
              </span>
            </div>
            <p className="font-bold text-muted-foreground text-2xl">
              Con Reuplan puedes organizar tus reuniones en tiempo récord, sin
              tener que ocuparte personalmente de la disponibilidad de tus
              invitados. Solamente indica en qué periodo debe ocurrir tu evento y
              tus invitados agregarán sus disponibilidades.
            </p>
            <Separator className="w-full" />
            <p className="font-light text-muted-foreground text-xl">
              La app sigue en fase de desarollo, es gratis, pero puedes aportar o
              pagar una suscripción para usarla de forma más potente y apoyar a su mantenimiento y mejora 🎉.
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
      {session?.user &&
      <MainActionButtons />}
    </div>
  );
}
