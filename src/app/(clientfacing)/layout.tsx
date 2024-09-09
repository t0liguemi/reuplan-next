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
import Footer from "../components/footer";

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
        <body className="bg-gradient-to-t from-bgcolorbottom to-bgcolortop bg-fixed bg-center bg-no-repeat antialiased">
        <Providers>
            <ThemeProvider attribute="class" storageKey="theme">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <div className="flex flex-col justify-between min-h-screen w-screen">
              <div>
                <Navbar />
                {children}
              </div>
              <Footer />
              </div>
              <Toaster />
              <Toaster2 />
              </HydrationBoundary>
            </ThemeProvider>
          </Providers>
        </body>
      </html>

  );
}
