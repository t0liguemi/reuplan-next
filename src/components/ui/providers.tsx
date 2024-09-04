"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from "react";
import { Provider } from "jotai";
import { SessionProvider } from "next-auth/react";


export const Providers = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      
      <Provider><SessionProvider>{children}</SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
};
