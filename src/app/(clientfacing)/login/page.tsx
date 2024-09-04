import SignInButton from "./loginButton";
import { auth } from "auth"
import SignOutButton from "./logoutButton";

export default async function Page() {
    const session = await auth();

    if (!session){
    return (
        <div>

            <SignInButton/>
        </div>
    )}
    else {
        return(
            <div>
                {JSON.stringify(session.user?.name)}
                <SignOutButton/>
            </div>
        )
    };
}