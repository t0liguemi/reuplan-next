import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";


export default async function HomePage() {

  return (
    <div className="min-w-screen my-8 flex flex-col items-center justify-center gap-8 px-12">
      <div className="flex items-start justify-start gap-12">
        <div className="flex flex-col items-start justify-start gap-4 py-5 text-xl max-w-[32em]">
            <div className="text-2xl">
              <span className="font-bold">Bienvenidx a </span>
              <span className="font-extrabold text-primary">Reu</span>
              <span className="text-success font-extrabold">Plan</span>
              <span className="font-bold">
                , una aplicación web minimalista con un único propósito: Facilitar
                los encuentros.
              </span>
            </div>
            <p className="font-semibold mt-4">
              Con Reuplan puedes organizar tus reuniones en tiempo récord, sin
              tener que ocuparte personalmente de la disponibilidad de tus
              invitados. Solamente indica en qué periodo debe ocurrir tu evento y
              tus invitados agregarán sus disponibilidades.
            </p>
            <p className="fs-5 fw-normal mt-4 opacity-75">
              <br />
              La app sigue en fase de desarollo, es gratis, pero puedes aportar o
              pagar una suscripción para usarla de forma más potente.
            </p>
        </div>
        <Image
          src="/assets/Calendarios.svg"
          alt="Calendarios"
          width={300}
          height={200}
          className="align-middle"
        />
      </div>
      <div className="flex gap-4">
      <Link href="/events" className="my-2">
        <Button className="text-xl">Mis eventos</Button>
      </Link>
      <Link href="/events/create" className="my-2">
        <Button variant={"success"} className="text-xl">Crear evento</Button>
      </Link>
      </div>
    </div>
  );
}
