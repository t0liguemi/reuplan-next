import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nickname: text("nickname"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isAdmin: boolean("isAdmin").default(false),
  isPremium: boolean("isPremium").default(false),
  showEmail: boolean("showEmail").default(true),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const event = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  name: text("name").notNull(),
  location: text("location"),
  from: timestamp("from").notNull(),
  to: timestamp("to").notNull(),
  description: text("description"),
  privacy_level: integer("privacy_level").notNull(),
  maps_query: boolean("maps_query"),
  host_id: text("host_id")
    .notNull()
    .references(() => users.id),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const invitation = pgTable(
  "invitation",
  {
    event_id: text("event_id")
      .notNull()
      .references(() => event.id),
    invitee_id: text("invitee_id")
      .notNull()
      .references(() => users.id),
    created_at: timestamp("created_at").defaultNow(),
  },
  (invitation) => ({
    compositePK: primaryKey({
      columns: [invitation.invitee_id, invitation.event_id],
    }),
  }),
);

export const response = pgTable("response", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  event_id: text("event_id")
    .notNull()
    .references(() => event.id),
  invitee_id: text("invitee_id")
    .notNull()
    .references(() => users.id),
  is_accepted: boolean("is_accepted").notNull(),
  date: timestamp("date"),
  start_time: timestamp("start_time"),
  end_time: timestamp("end_time"),
  created_at: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  events: many(event),
  invitations: many(invitation),
  responses: many(response),
}));

export const eventRelations = relations(event, ({ many }) => ({
  invitations: many(invitation),
  responses: many(response),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  event: one(event, {
    fields: [invitation.event_id],
    references: [event.id],
  }),
}));

export const responseRelations = relations(response, ({ one }) => ({
  event: one(event, {
    fields: [response.event_id],
    references: [event.id],
  }),
}));
