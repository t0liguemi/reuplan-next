import { signOut } from "auth"
 
export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Signout</button>
    </form>
  )
} 