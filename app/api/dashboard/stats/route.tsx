import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
    try {
        // Try to get current user, but don't fail if not available
        let user;
        try {
            user = await currentUser();
        } catch (authError) {
            console.log("Auth check error, continuing with default data:", authError);
            // Continue without user - this allows build to succeed
        }

        let totalReports = 0;
        let cancerPositive = 0;
        let averageConfidence = 0;

        // Only try to get real data if we have a user
        if (user) {
            try {
                // Get all reports
                const allReports = await db.select().from(SessionChatTable);
                totalReports = allReports.length;
                
                // Calculate actual cancer positive reports
                const positiveReports = allReports.filter(report => {
                    try {
                        if (typeof report.report === 'string') {
                            const parsed = JSON.parse(report.report);
                            return parsed.analysisResults === 'Cancer Positive';
                        }
                        return false;
                    } catch {
                        return false;
                    }
                });
                
                cancerPositive = positiveReports.length;
                
                // Calculate average confidence
                const confidences = allReports.map(report => {
                    try {
                        if (typeof report.report === 'string') {
                            const parsed = JSON.parse(report.report);
                            // Remove % sign and convert to number
                            return parseFloat(parsed.confidence?.replace('%', '') || '0');
                        }
                        return 0;
                    } catch {
                        return 0;
                    }
                });
                
                if (confidences.length > 0) {
                    const sum = confidences.reduce((acc, val) => acc + val, 0);
                    averageConfidence = sum / confidences.length;
                }
            } catch (dbError) {
                console.error("Database error, using default values:", dbError);
                // Use default values on database error
                totalReports = 0;
                cancerPositive = 0;
                averageConfidence = 0;
            }
        } else {
            // Provide sample data for build/unauthenticated states
            totalReports = 0;
            cancerPositive = 0;
            averageConfidence = 0;
        }

        return NextResponse.json({
            totalReports,
            cancerPositive,
            averageConfidence,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Return default data on any error to prevent build failures
        return NextResponse.json({
            totalReports: 0,
            cancerPositive: 0,
            averageConfidence: 0,
            timestamp: new Date().toISOString()
        });
    }
}