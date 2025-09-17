import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Get all reports
        const allReports = await db.select().from(SessionChatTable);
        
        // For demo purposes, provide sample statistics
        const totalReports = allReports.length;
        
        // Let's say we have 2 cancer positive reports out of all
        const cancerPositive = 2;
        
        // Sample average confidence
        const averageConfidence = 90.8;

        return NextResponse.json({
            totalReports,
            cancerPositive,
            averageConfidence,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch dashboard stats",
            details: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}