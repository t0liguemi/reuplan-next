"use client";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { MoonIcon, SunIcon } from "lucide-react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Switch } from "~/components/ui/switch";
import { useQueries } from "@tanstack/react-query";
import {
  getCurrentUsersEvents,
  getCurrentUserResponses,
  getCurrentUserInvitations,
} from "~/server/actions";
import React from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const session = useSession();
  const userQueries = useQueries({
    queries: [
      {
        queryKey: ["userResponses", session.data?.user?.id],
        queryFn: () => getCurrentUserResponses(session.data?.user?.id ?? ""),
      },
      {
        queryKey: ["userEvents", session.data?.user?.id],
        queryFn: () => getCurrentUsersEvents(session.data?.user?.id ?? ""),
      },
      {
        queryKey: ["userInvitations", session.data?.user?.id],
        queryFn: () => getCurrentUserInvitations(session.data?.user?.id ?? ""),
      },
    ],
  });

  const pendingInvitations = React.useMemo(() => {
    let counter = 0;
    if (userQueries[1].data) {
      for (const event of userQueries[1].data) {
        const response = userQueries[0].data?.find(
          (resp) => resp.event_id === event.id,
        );
        if (
          response === undefined &&
          userQueries[2].data?.some((inv) => inv.event_id === event.id)
        ) {
          counter += 1;
        }
      }
    }
    return counter;
  }, [userQueries]);

  React.useEffect(() => {
    if (pendingInvitations === 1) {
      toast(`You have one pending invitation!`);
    } else if (pendingInvitations > 0) {
      toast(`You have ${pendingInvitations} pending invitations!`);
    }
  }, [pendingInvitations]);

  if (session.status === "authenticated") {
    return (
      <nav className="flex h-14 w-screen items-center justify-between px-4 py-4">
        <div className="flex items-center text-xl font-extrabold">
          <Link href="/" className="mx-0 flex items-center px-0">
            <Image
              src="/logo.svg"
              alt="logo"
              width={26}
              height={26}
              className="mx-0 px-0"
            />
          </Link>
          <Link href="/" className="mx-0 px-0">
            <div>
              <span className="text-primary">Reu</span>
              <span className="text-success">plan</span>
            </div>
          </Link>
          {session.data.user.isAdmin && (
            <span className="mx-1 font-light">Admin</span>
          )}
          {!session.data.user.isAdmin && session.data.user.isPremium && (
            <span className="font-normal text-secondary">Premium</span>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <div
            className="flex items-center gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <MoonIcon className="h-4 w-4" />

            <Switch checked={theme === "light"} />
            <SunIcon className="h-4 w-4" />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative">
                  <Avatar
                    className={
                      pendingInvitations > 0
                        ? "border-2 border-destructive"
                        : "border-2 border-border"
                    }
                  >
                    <AvatarImage src={session.data.user.image ?? undefined} />
                    <AvatarFallback>
                      {session.data.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>{" "}
                  {pendingInvitations != 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute bottom-0 right-[-5px]"
                    >
                      {pendingInvitations}
                    </Badge>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-muted/20 backdrop-blur-lg">
                <DropdownMenuLabel asChild>
                  <Link href="/events">
                    Events{" "}
                    {pendingInvitations != 0 && (
                      <Badge variant="destructive" className="mx-2">
                        {pendingInvitations}
                      </Badge>
                    )}{" "}
                  </Link>
                </DropdownMenuLabel>

                <Link href="/">
                  <DropdownMenuItem>Home</DropdownMenuItem>
                </Link>

                {session.data.user.isAdmin ? (
                  <Link href="/users">
                    <DropdownMenuItem>Users</DropdownMenuItem>
                  </Link>
                ) : null}
                
                <DropdownMenuItem asChild>
                  <Link href={"/account"}>Account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button onClick={() => signOut()}>Logout</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    );
  } else if (session.status === "loading") {
    return (
      <nav className="flex h-14 w-screen items-center justify-between px-4 py-4">
        <div className="flex items-center text-xl font-extrabold">
          <Link href="/" className="mx-0 flex items-center px-0">
            <Image
              src="/logo.svg"
              alt="logo"
              width={26}
              height={26}
              className="mx-0 px-0"
            />
          </Link>
          <Link href="/" className="mx-0 px-0">
            <div>
              <span className="text-primary">Reu</span>
              <span className="text-success">plan</span>
            </div>
          </Link>
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <MoonIcon className="h-4 w-4" />
          <Switch checked={theme === "light"} />
          <SunIcon className="h-4 w-4" />
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="flex h-14 w-screen items-center justify-between px-4 py-4">
        <div className="flex items-center text-xl font-extrabold">
          <Link href="/" className="mx-0 flex items-center px-0">
            <Image
              src="/logo.svg"
              alt="logo"
              width={26}
              height={26}
              className="mx-0 px-0"
            />
          </Link>
          <Link href="/" className="mx-0 px-0">
            <div>
              <span className="text-primary">Reu</span>
              <span className="text-success">plan</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-row gap-2">
          <div
            className="flex items-center gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <MoonIcon className="h-4 w-4" />
            <Switch checked={theme === "light"} />
            <SunIcon className="h-4 w-4" />
          </div>
          <Button onClick={() => signIn()}>Login</Button>
        </div>
      </nav>
    );
  }
}
