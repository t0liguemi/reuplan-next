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
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { relations } from "drizzle-orm";

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
  host_id: text("host_id").notNull(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  event_id: text("event_id").notNull(),
  invitee_id: text("invitee_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
}, (t)=>({
  unq: unique().on(t.invitee_id, t.event_id)
}));

export const response = pgTable("response", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  event_id: text("event_id")
    .notNull()
    .references(() => event.id),
  invitee_id: text("invitee_id").notNull(),
  is_accepted: boolean("is_accepted").notNull(),
  date: timestamp("date"),
  start_time: integer("start_time"),
  end_time: integer("end_time"),
  created_at: timestamp("created_at").defaultNow(),
});

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


