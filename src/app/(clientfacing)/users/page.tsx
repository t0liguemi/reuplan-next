"use server";
import React from "react";
import { getRoles, getUsers } from "~/server/actions";
import Image from "next/image";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type * as _ from "auth0";

export default withPageAuthRequired(
  async function Users() {
    const users = await getUsers();

    
    const roles : _.Role[][] = [];
    if (users.length > 0) {
      for (const user of users) {
        typeof user.user_id == "string"
          ? roles.push(await getRoles(user.user_id))
          : roles.push([]);
      }
    }


    return (
      <main className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold text-black my-4">Users</h1>
        {users ? (
          users.map((user, i) => {
            return (
              <div
                key={user.user_id}
                className="flex w-4/12 items-center justify-start gap-2 rounded-md border-2 border-black bg-white p-3"
              >
                <div className="flex-col">
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt="Profile Picture"
                      className="rounded-full border-2 border-slate-200"
                      width={50}
                      height={50}
                    />
                  ) : (
                    <></>
                  )}
                </div>

                <div className="flex flex-col gap-2 text-black">
                  <span className="text-sm">userID: {user.user_id}</span>
                  <span> {user.email}</span>
                  <span>{user.name}</span>
                  <span>{roles[i] && roles[i].length > 0 ? roles[i].map((role) => role.name).join(", ") : ""}</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>No users</p>
        )}
      </main>

    );
  },
  { returnTo: "/" },
);
