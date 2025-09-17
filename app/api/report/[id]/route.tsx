import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const sessionId = params.id;
        
        if (!sessionId) {
            return NextResponse.json({
                success: false,
                error: "Validation Error",
                details: "Session ID is required",
            }, { status: 400 });
        }

        // Get report from database
        const report = await db
            .select()
            .from(SessionChatTable)
            .where(eq(SessionChatTable.sessionId, sessionId))
            .limit(1);

        if (!report || report.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Not Found",
                details: `No report found with session ID: ${sessionId}`,
            }, { status: 404 });
        }

        // Parse the JSON fields
        const reportData = {
            ...report[0],
            report: report[0].report ? JSON.parse(report[0].report as string) : null,
            conversation: report[0].conversation ? JSON.parse(report[0].conversation as string) : null,
        };

        return NextResponse.json({
            success: true,
            report: reportData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error fetching report:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch report",
            details: error instanceof Error ? error.message : String(error),
            errorType: "DATABASE_ERROR",
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}