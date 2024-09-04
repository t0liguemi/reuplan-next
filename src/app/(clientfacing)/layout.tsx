import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";
import Navbar from "../components/navbar";
import { Toaster } from "~/components/ui/sonner";
import { Toaster as Toaster2 } from "~/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../lib/get-query-client";
import { Providers } from "~/components/ui/providers";

export const metadata: Metadata = {
  title: "Reuplan",
  description: "Reuplan v0.2",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const queryClient = getQueryClient();

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (

      <html lang="en" className={inter.className} suppressHydrationWarning>
        <body className="min-h-screen bg-gradient-to-t from-bgcolorbottom to-bgcolortop bg-fixed bg-center bg-no-repeat pb-8 antialiased">
        <Providers>
            <ThemeProvider attribute="class" storageKey="theme">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Navbar />
              {children}
              <Toaster />
              <Toaster2 />
              </HydrationBoundary>
            </ThemeProvider>
          </Providers>
        </body>
      </html>

  );
}
