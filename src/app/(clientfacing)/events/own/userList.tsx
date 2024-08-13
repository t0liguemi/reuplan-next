"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";


import React from "react";
import type { User } from "auth0";

import { getCurrentUsersEvents } from "~/server/actions";
import { useQuery } from "react-query";



export default function UserList( {users}:{users:User[]}) {

  const [currentUser, setCurrentUser] = React.useState<string|undefined>();
  const {isLoading,error,data} = useQuery({queryKey:['ownEvents',currentUser], queryFn: async () => await getCurrentUsersEvents(currentUser)})


  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="my-2">
        <Select onValueChange={async (e:string)=>{setCurrentUser((e))}}>
          <SelectTrigger>
            <SelectValue placeholder="User" />
          </SelectTrigger>

          <SelectContent>
            {users.map((user, index) =>(user.user_id?
              <SelectItem value={user.user_id.toString()} key={index}>
                {user.username ?? user.email}
              </SelectItem>
              :null
            ))}
          </SelectContent>
        </Select>
      </div>
{      currentUser?
      <div className="flex flex-col gap-4 justify-center items-center">
        <h3>Eventos del usuario {currentUser.toString()}</h3>
        {data && <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4"> 
          {data.map((event, index) => (
            <div key={index} className="rounded-lg border-2 border-primary p-4">
              <h3 className="text-sm font-bold">{event.name}</h3>
              <p className="text-sm">{event.location}</p>
              <p className="text-sm">{event.host_id}</p>
            </div>
          ))}
        </div>}
        {isLoading && <div className="p-4 m-8 flex flex-col gap-4 justify-center">Loading...</div>}
        {error? <div className="p-4 m-8 flex flex-col gap-4 justify-center">Error loading data</div>:null}
      </div>:null}
    </div>
  );
}
