import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const SessionChatTable = pgTable("sessionChatTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar({ length: 255 }).notNull().unique(),
    report: json(),
    createdAt: varchar({ length: 255 }).notNull(),
});