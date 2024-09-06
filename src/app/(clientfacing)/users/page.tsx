import { db } from "~/server/db";
import FailedPage from "./fail";
import { auth } from "auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default async function Page() {
  const session = await auth();
  const users = await db.query.users.findMany();

  if (session?.user.isAdmin) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4 md:px-8 lg:px-12">
        <h1 className="my-4 text-5xl font-extrabold">Users</h1>
        <p>
          This will be a list of all users in the app with their roles, with
          exclusive access to admins
        </p>
        <div className="flex flex-row gap-2">
          {users.map((user, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 rounded-md border-2 bg-muted p-2 ${!user.isAdmin ? "border-border" : "border-secondary"}`}
            >
              <p className="flex gap-2"><Avatar><AvatarImage src={user.image??undefined}/><AvatarFallback/></Avatar>{user.nickname}</p> <p>{user.email}</p> <p>{user.name}</p>
              {user.isPremium && <p>Premium</p>} {user.isAdmin && <p>Admin</p>}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <FailedPage />;
  }
}
