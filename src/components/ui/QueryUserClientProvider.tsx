"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Provider } from "jotai"

export const QueryUserClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Provider>
        {children}
        </Provider>
      </UserProvider>
    </QueryClientProvider>
  );
};
