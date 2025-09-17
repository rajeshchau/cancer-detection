import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const SessionChatTable = pgTable("sessionChatTable", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar({ length: 255 }).notNull().unique(),
    notes: text(),
    conversation: json(),
    report: json(),
    analysisResults: text(), // To store the analysis results (e.g., "Cancer Positive")
    confidence: varchar({ length: 10 }), // To store confidence percentage (e.g., "98%")
    evidence: text(), // To store evidence details
    extractedText: text(), // To store the extracted text from the report
    createdAt: varchar({ length: 255 }).notNull(),
});