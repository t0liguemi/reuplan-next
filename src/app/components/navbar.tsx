"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
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

export default function Navbar({
  isAdmin,
  isPremium,
}: {
  isAdmin: boolean;
  isPremium: boolean;
}) {
  const { user, error, isLoading } = useUser();

  if (!user) {
    return (
      <nav className="flex h-14 w-screen items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2 text-2xl font-extrabold">
          <div>
            <span className="text-primary">Reu</span>
            <span className="text-success">Plan</span>
          </div>
        </div>
        Not logged in
        <a href="/api/auth/login">
          <Button variant={"default"}>Login</Button>
        </a>
      </nav>
    );
  } else if (user) {
    return (
      <nav className="flex h-14 w-screen items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2 text-2xl font-extrabold">
          <Link href="/">
            <div>
              <span className="text-primary">Reu</span>
              <span className="text-success">Plan</span>
            </div>
          </Link>
          {isAdmin ? <span className="font-mono">Admin</span> : null}
          {isPremium && !isAdmin ? <span className="font-normal text-secondary">Premium</span> : null}
        </div>
        <div className="flex items-center gap-2"></div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {user.picture ? (
                <Image
                  src={user.picture}
                  className="rounded-full border-2 border-primary"
                  alt="profile pic"
                  width={40}
                  height={40}
                />
              ) : (
                <></>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem>Home</DropdownMenuItem>
              </Link>
              <Link href="/events">
                <DropdownMenuItem>Events</DropdownMenuItem>
                </Link>
              <Link href="/calendar">
                <DropdownMenuItem>Calendar</DropdownMenuItem>
              </Link>
              {isAdmin ? (
                <Link href="/users">
                  <DropdownMenuItem>Users</DropdownMenuItem>
                </Link>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/api/auth/logout">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    );
  }
}
