"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";


import React from "react";
import type { api_user } from "drizzle/schema";

import { getCurrentUsersEvents } from "~/server/actions";
import { useQuery } from "react-query";



export default function UserList( {users}:{users:typeof api_user.$inferSelect[]}) {

  const [currentUser, setCurrentUser] = React.useState<number>(1);
  const {isLoading,error,data} = useQuery({queryKey:['ownEvents',currentUser], queryFn: async () => await getCurrentUsersEvents(currentUser)})


  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="my-2">
        <Select onValueChange={async (e:string)=>{setCurrentUser(parseInt(e))}}>
          <SelectTrigger>
            <SelectValue placeholder="User" />
          </SelectTrigger>

          <SelectContent>
            {users.map((user, index) => (
              <SelectItem value={user.id.toString()} key={index}>
                {user.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h3>Eventos del usuario {currentUser.toString()}</h3>
        {data && <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4"> 
          {data.map((event, index) => (
            <div key={index} className="rounded-lg border-2 border-primary p-4">
              <h3 className="text-sm font-bold">{event.name}</h3>
              <p className="text-sm">{event.lugar}</p>
              <p className="text-sm">{event.organizador_id}</p>
            </div>
          ))}
        </div>}
        {isLoading && <div className="p-4 m-8 flex flex-col gap-4 justify-center">Loading...</div>}
        {error? <div className="p-4 m-8 flex flex-col gap-4 justify-center">Error loading data</div>:null}
      </div>
    </div>
  );
}
