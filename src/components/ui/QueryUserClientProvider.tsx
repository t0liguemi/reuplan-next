"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const queryClient = new QueryClient();

export const QueryUserClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </UserProvider>
  );
};
