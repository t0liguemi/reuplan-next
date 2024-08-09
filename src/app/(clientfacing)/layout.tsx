import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navbar from "../components/navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { getRoles } from "~/server/actions";
import { QueryUserClientProvider } from "~/components/ui/QueryUserClientProvider";

export const metadata: Metadata = {
  title: "Reuplan testland",
  description: "Reuplan on T3",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const roles =
    session && typeof session.user.sub == "string"
      ? await getRoles(session.user.sub)
      : [];
  const isPremium = roles.some((role) => role.name === "Premium");
  const isAdmin = roles.some((role) => role.name === "Admin");

  return (
    <QueryUserClientProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
          <body className="min-w-screen min-h-screen bg-gradient-to-t from-zinc-300 to-zinc-50 bg-fixed bg-no-repeat bg-center">
            <Navbar isAdmin={isAdmin} isPremium={isPremium} />
            {children}
          </body>
      </html>
    </QueryUserClientProvider>
  );
}
