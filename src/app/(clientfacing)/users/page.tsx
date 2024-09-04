import FailedPage from "./fail";
import { auth } from "auth";


export default async function Page() {
    const session = await auth();

    if (session?.user.isAdmin){
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:px-12 md:px-8 px-4">
        <h1 className="my-4 text-5xl font-extrabold">Users</h1>
        <p>This will be a list of all users in the app with their roles, with exclusive access to admins</p>
      </div>
    );
  }else{
    return <FailedPage />
  }}
