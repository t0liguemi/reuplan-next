"use client";
import React from "react";
import { SignIn } from "../components/signin";
import { SignOut } from "../components/signout";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export function Client() {
  const { user, error, isLoading } = useUser();
  console.log(user);

  if (isLoading) {
    return (
      <h4 className="font-superbold p-4 text-2xl text-black">Loading...</h4>
    );
  }
  if (error) {
    return (
      <h4 className="font-super boldtext-black p-4 text-2xl">
        {error.message}
      </h4>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-md border-black">
      <h1 className="font-bold text-3xl text-black">This is a Client Component</h1>
      {user ? <SignOut /> : <SignIn />}
      <p className="text-black font-light text-xl">
      {user
        ? `Logged in as ${user.name} with email ${user.email}`
        : "Not logged in"}</p>
        {user?.picture? <Image src={user.picture} alt="Profile Picture" className="rounded-full" width={75}  height={75} /> : null}
    </div>
  );
}
