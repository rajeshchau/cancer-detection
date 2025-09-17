import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const reportId = params.id;
    
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // First try to find by id
        let sessionData = await db
            .select()
            .from(SessionChatTable)
            .where(eq(SessionChatTable.id, parseInt(reportId)))
            .limit(1);

        // If not found by id, try to find by sessionId
        if (sessionData.length === 0) {
            sessionData = await db
                .select()
                .from(SessionChatTable)
                .where(eq(SessionChatTable.sessionId, reportId))
                .limit(1);
        }

        if (sessionData.length === 0) {
            return NextResponse.json({ error: "No data found for the given ID" }, { status: 404 });
        }

        const session = sessionData[0];

        // For demo purposes, provide sample data for specific report IDs
        let analysisResults = session.analysisResults || 'Processing';
        let confidence = session.confidence || 'N/A';
        let evidence = session.evidence || '';
        let extractedText = session.extractedText || '';

        // If ID is 1, use the sample blood cancer report
        if (session.id === 1) {
            analysisResults = 'Cancer Positive';
            confidence = '92%';
            evidence = 'The report explicitly labels the diagnostic report as "Hematological Malignancy (Blood Cancer)" and describes the patient presenting with advanced symptoms highly suggestive of a malignant hematological disorder, along with a comprehensive work‑up (CBC, peripheral smear, bone marrow biopsy, flow cytometry, cytogenetics, and imaging) performed to confirm blood cancer.';
            extractedText = 'Confidential Medical Report CityGeneral Hospital DiagnosticReport: Hematological Malignancy (Blood Cancer) CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 16, 2025 PatientInformation Name: John Doe Age: 45 PatientID: 987654 Date of Birth: January 15, 1980 Referring Physician: Dr. Emily Carter, MD ClinicalPresentation The patient presented with advanced symptoms highly suggestive of a malignant hematological disorder, including: • Severe persistent fatigue and profound weakness • Significant unexplained weight loss (15 kg over 2 months) • Frequent recurrent infections and fever • Extensive easy bruising, petechiae, and bleeding tendencies • Enlarged lymph nodes and splenomegaly indicative of possible metastatic spread DiagnosticTestsPerformed The following comprehensive tests were conducted on September 10, 2025, to confirm the presence of blood cancer: • Complete Blood Count (CBC) • Peripheral Blood Smear • Bone Marrow Biopsy and Aspiration • Flow Cytometry • Cytogenetic and Molecular Analysis • Imaging (CT/MRI) for Metastasis Assessment 1 of ??';
        } 
        // For report ID 2, set to Cancer Negative with data
        else if (session.id === 2) {
            analysisResults = 'Cancer Negative';
            confidence = '89%';
            evidence = 'The report indicates normal findings with no evidence of malignancy.';
            extractedText = 'Confidential Medical Report CityGeneral Hospital Routine Health Screening Report CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 14, 2025 PatientInformation Name: Jane Smith Age: 42 PatientID: 876543 Date of Birth: March 22, 1983 Primary Care Physician: Dr. Robert Johnson, MD ExaminationFindings Physical examination: Normal vital signs, no abnormal findings in all major organ systems. Laboratory tests: CBC, metabolic panel, and other routine bloodwork within normal ranges. Radiological studies: Chest X-ray clear, no suspicious masses or abnormalities identified. Conclusion: No evidence of malignancy or other significant health concerns at this time. Recommendations: Continue routine health screenings as scheduled. Follow up in one year for next annual examination.';
        }

        const report = {
            id: String(session.id),
            sessionId: session.sessionId,
            filename: `report-${session.id}.pdf`,
            uploadDate: new Date(session.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            analysisResults: analysisResults,
            confidence: confidence,
            evidence: evidence,
            extractedText: extractedText,
            createdAt: session.createdAt,
            notes: session.notes,
            conversation: session.conversation,
        };

        return NextResponse.json(report);
    } catch (error) {
        console.error("Error fetching report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}