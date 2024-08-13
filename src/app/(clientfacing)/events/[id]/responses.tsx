"use client";
import { useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { getResponses } from "~/server/actions";
import { response } from "~/server/db/schema";

export default function Responses(props: {query:UseQueryResult<typeof response.$inferSelect[],Error>, eventId: string }) {
const {query,eventId} = props;

  const { isLoading, data, error } = query

  if (isLoading) {
    <div className="my-4">
      <h2>Responses :Loading...</h2>
      <div className="my-4 flex flex-col flex-wrap justify-start gap-2 align-baseline">
        <h2 className="text-2xl font-light">Responses:</h2>
        <Skeleton className="h-[24px] w-[512px]" />
        <Skeleton className="h-[24px] w-[512px]" />
        <Skeleton className="h-[24px] w-[512px]" />
        <Skeleton className="h-[24px] w-[512px]" />
      </div>
    </div>;
  }
  if (data) {
    return (
      <div className="flex gap-2 my-4">
        {data.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-light">Responses:</h2>
            {data.map((response, index) =>
              response.is_accepted ? (
                <div
                  key={index}
                  className={`flex flex-row justify-between rounded-sm px-4 py-1 text-sm ${index % 2 === 0 ? "bg-slate-300" : "bg-slate-50"}`}
                >
                  <p className="">{response.id}</p>
                  <p className="">user: {response.invitee_id}</p>
                  <p className="">{response.date?.toLocaleDateString()}</p>
                  <p className="">
                    {response.start_time?.toString().slice(-4, -2) +
                      ":" +
                      response.start_time?.toString().slice(-2)}{" "}
                    -{" "}
                    {response.end_time?.toString().slice(-4, -2) +
                      ":" +
                      response.end_time?.toString().slice(-2)}
                  </p>
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <h2 key="noresponse" className="my-4 text-2xl font-light">
            Responses: No responses yet 😢😢
          </h2>
        )}
      </div>
    );
  }
  if (error) {
    return <div className="my-4 text-2xl font-light">Error loading responses</div>;
  }
}
