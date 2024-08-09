import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default async function PrivatePage() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-black p-3">
      <h1 className="text-3xl font-bold text-black">
        This is a Server Component
      </h1>
      {session ? (
        <p className="text-xl font-light text-black">
          Logged in as {session.user.name}
        </p>
      ) : (
        <p>Not logged in</p>
      )}

      {session && typeof session.user.picture == "string" ? (
        <Image
          src={session.user.picture}
          alt="Profile Picture"
          className="rounded-full"
          width={75}
          height={75}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
