import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser, type User } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

interface ReportData {
    analysisResults?: string;
    confidence?: string;
    evidence?: string;
    extractedText?: string;
    sessionId?: string;
    createdAt?: string;
    [key: string]: any;
}

interface Report {
    id: string;
    filename: string;
    createdAt: string;
    analysisResults: string;
    confidence: string;
    evidence: string;
    extractedText: string;
    sessionId: string;
    userId: string;
}

export async function GET(req: NextRequest): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId') || '';
        
        // Try to get the user but don't fail if not available (for build process)
        let user: User | null = null;
        try {
            user = await currentUser();
        } catch (authError) {
            console.log("Auth check error, continuing with empty data:", authError);
            // Return empty array during build
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json([]);
            }
        }
        
        // If no user and not in production build, return authentication error
        if (!user && process.env.NODE_ENV !== 'production') {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        let reports: Report[] = [];

        // For build time or when no user is available, return empty array
        if (!user) {
            return NextResponse.json([]);
        }

        if (sessionId === "all") {
            try {
                const result = await db.select().from(SessionChatTable)
                    .orderBy(desc(SessionChatTable.id));
                
                // Transform data to match the Report interface
                reports = result.map(item => {
                    let reportData: ReportData = {};
                    
                    try {
                        if (typeof item.report === 'string') {
                            reportData = JSON.parse(item.report);
                        }
                    } catch (e) {
                        console.error("Error parsing report JSON:", e);
                    }
                    
                    return {
                        id: String(item.id),
                        filename: `report-${item.id}.pdf`,
                        createdAt: item.createdAt,
                        analysisResults: reportData.analysisResults || 'Processing',
                        confidence: reportData.confidence || 'N/A',
                        evidence: reportData.evidence || '',
                        extractedText: reportData.extractedText || '',
                        sessionId: item.sessionId,
                        userId: user.id
                    };
                });
            } catch (dbError) {
                console.error("Database error:", dbError);
                // Use empty array on database error
                reports = [];
            }
        } else if (sessionId) {
            try {
                const result = await db.select().from(SessionChatTable)
                    .where(eq(SessionChatTable.sessionId, sessionId));
                
                // Transform single result
                reports = result.map(item => {
                    let reportData: ReportData = {};
                    
                    try {
                        if (typeof item.report === 'string') {
                            reportData = JSON.parse(item.report);
                        }
                    } catch (e) {
                        console.error("Error parsing report JSON:", e);
                    }
                    
                    return {
                        id: String(item.id),
                        filename: `report-${item.id}.pdf`,
                        createdAt: item.createdAt,
                        analysisResults: reportData.analysisResults || 'Processing',
                        confidence: reportData.confidence || 'N/A',
                        evidence: reportData.evidence || '',
                        extractedText: reportData.extractedText || '',
                        sessionId: item.sessionId,
                        userId: user.id
                    };
                });
            } catch (dbError) {
                console.error("Database error:", dbError);
                // Use empty array on database error
                reports = [];
            }
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        // Return empty array for build time
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json([]);
        }
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}