import NextAuth, {type DefaultSession} from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "~/server/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

declare module "next-auth"{
  interface Session {
      user:{
          nickname:string | undefined
          isPremium:boolean
          isAdmin:boolean
          name: string
          id:string
          email:string
          showEmail:boolean
      } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google,
  ],
  adapter: DrizzleAdapter(db,{
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
});
