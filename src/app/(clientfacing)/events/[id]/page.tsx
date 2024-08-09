import React from "react";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { api_evento, api_respuesta } from "drizzle/schema";

export default async function EventPage({
  params: { id: id },
}: {
  params: { id: number };
}) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;

  const event = id
    ? await db.query.api_evento.findFirst({
        where: eq(api_evento.id, id),
      })
    : undefined;
  const respuestas = await db.query.api_respuesta.findMany({
    where: eq(api_respuesta.evento_id, id),
  });

  return event ? (
    <div className="my-4 flex flex-col px-12">
      <h1 className="my-4 text-4xl font-extrabold">Event: {event.name}</h1>

      <p>
        Desde el {new Date(event.inicio).toLocaleDateString("es-ES", options)}{" "}
        al {new Date(event.final).toLocaleDateString("es-ES", options)}
      </p>
      <p>{event.descripcion}</p>

      <div className="flex flex-col gap-2">
        {respuestas.map((respuesta, index) => (
          <div
            key={index}
            className={`flex flex-row justify-between rounded-sm px-4 py-1 text-sm ${index % 2 === 0 ? "bg-slate-300" : "bg-slate-50"}`}
          >
            <p className="">{respuesta.id}</p>
            <p className="">user: {respuesta.invitado_id}</p>
            <p className="">{respuesta.fecha}</p>
            <p className="">
              {respuesta.inicio.toString().slice(-4, -2) +
                ":" +
                respuesta.inicio.toString().slice(-2)}{" "}
              -{" "}
              {respuesta.final.toString().slice(-4, -2) +
                ":" +
                respuesta.final.toString().slice(-2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="my-4 flex flex-col px-12">
      <h1 className="my-4 text-4xl font-extrabold">Evento no encontrado</h1>
      <p className="my-2 text-xl">
        Este evento no existe, o no has sido invitado 😢
      </p>
      <Link href="/events" className="my-2">
        <Button>Volver a eventos</Button>
      </Link>
    </div>
  );
}
