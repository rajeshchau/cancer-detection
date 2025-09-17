import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";

async function seedDatabase() {
    try {
        await db.insert(SessionChatTable).values({
            sessionId: "1",
            notes: "Test notes",
            conversation: { message: "Test conversation" },
            report: { key: "value" },
            analysisResults: "Cancer Negative",
            confidence: "95%",
            evidence: "No significant findings",
            extractedText: "Sample extracted text",
            createdAt: new Date().toISOString(),
        });
        console.log("Test record inserted successfully.");
    } catch (error) {
        console.error("Error inserting test record:", error);
    }
}

seedDatabase();