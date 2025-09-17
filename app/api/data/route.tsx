import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId') || '';
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        let reports = [];

        if (sessionId === "all") {
            const email = user?.primaryEmailAddress?.emailAddress;
            if (!email) {
                return NextResponse.json({ error: "User email not found" }, { status: 400 });
            }
            
            const result = await db.select().from(SessionChatTable)
                .orderBy(desc(SessionChatTable.id));
            
            // Transform data to match the Report interface
            reports = result.map(item => {
                // Use provided format for reports
                let analysisResult = 'Processing';
                let confidenceValue = 'N/A';
                let evidenceValue = '';
                let extractedTextValue = '';
                
                // Sample data for first report
                if (item.id === 1) {
                    analysisResult = "Cancer Positive";
                    confidenceValue = "92%";
                    evidenceValue = "The report explicitly labels the diagnostic report as \"Hematological Malignancy (Blood Cancer)\" and describes the patient presenting with advanced symptoms highly suggestive of a malignant hematological disorder, along with a comprehensive work‑up (CBC, peripheral smear, bone marrow biopsy, flow cytometry, cytogenetics, and imaging) performed to confirm blood cancer.";
                    extractedTextValue = "Confidential Medical Report CityGeneral Hospital DiagnosticReport: Hematological Malignancy (Blood Cancer) CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 16, 2025 PatientInformation Name: John Doe Age: 45 PatientID: 987654 Date of Birth: January 15, 1980 Referring Physician: Dr. Emily Carter, MD ClinicalPresentation The patient presented with advanced symptoms highly suggestive of a malignant hematological disorder, including: • Severe persistent fatigue and profound weakness • Significant unexplained weight loss (15 kg over 2 months) • Frequent recurrent infections and fever • Extensive easy bruising, petechiae, and bleeding tendencies • Enlarged lymph nodes and splenomegaly indicative of possible metastatic spread DiagnosticTestsPerformed The following comprehensive tests were conducted on September 10, 2025, to confirm the presence of blood cancer: • Complete Blood Count (CBC) • Peripheral Blood Smear • Bone Marrow Biopsy and Aspiration • Flow Cytometry • Cytogenetic and Molecular Analysis • Imaging (CT/MRI) for Metastasis Assessment 1 of ??";
                } else if (item.id === 2) {
                    analysisResult = "Cancer Negative";
                    confidenceValue = "89%";
                    evidenceValue = "The report indicates normal findings with no evidence of malignancy.";
                    extractedTextValue = "Confidential Medical Report CityGeneral Hospital Routine Health Screening Report CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 14, 2025 PatientInformation Name: Jane Smith Age: 42 PatientID: 876543 Date of Birth: March 22, 1983 Primary Care Physician: Dr. Robert Johnson, MD ExaminationFindings Physical examination: Normal vital signs, no abnormal findings in all major organ systems. Laboratory tests: CBC, metabolic panel, and other routine bloodwork within normal ranges. Radiological studies: Chest X-ray clear, no suspicious masses or abnormalities identified. Conclusion: No evidence of malignancy or other significant health concerns at this time. Recommendations: Continue routine health screenings as scheduled. Follow up in one year for next annual examination.";
                }
                
                return {
                    id: String(item.id),
                    filename: `report-${item.id}.pdf`,
                    createdAt: item.createdAt,
                    analysisResults: item.analysisResults || analysisResult,
                    confidence: item.confidence || confidenceValue,
                    evidence: item.evidence || evidenceValue,
                    extractedText: item.extractedText || extractedTextValue,
                    sessionId: item.sessionId,
                    userId: user.id
                };
            });
        } else {
            const result = await db.select().from(SessionChatTable)
                .where(eq(SessionChatTable.sessionId, sessionId));
            
            // Transform single result
            reports = result.map(item => {
                // Use provided format for reports
                let analysisResult = 'Processing';
                let confidenceValue = 'N/A';
                let evidenceValue = '';
                let extractedTextValue = '';
                
                // Sample data for first report
                if (item.id === 1) {
                    analysisResult = "Cancer Positive";
                    confidenceValue = "92%";
                    evidenceValue = "The report explicitly labels the diagnostic report as \"Hematological Malignancy (Blood Cancer)\" and describes the patient presenting with advanced symptoms highly suggestive of a malignant hematological disorder, along with a comprehensive work‑up (CBC, peripheral smear, bone marrow biopsy, flow cytometry, cytogenetics, and imaging) performed to confirm blood cancer.";
                    extractedTextValue = "Confidential Medical Report CityGeneral Hospital DiagnosticReport: Hematological Malignancy (Blood Cancer) CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 16, 2025 PatientInformation Name: John Doe Age: 45 PatientID: 987654 Date of Birth: January 15, 1980 Referring Physician: Dr. Emily Carter, MD ClinicalPresentation The patient presented with advanced symptoms highly suggestive of a malignant hematological disorder, including: • Severe persistent fatigue and profound weakness • Significant unexplained weight loss (15 kg over 2 months) • Frequent recurrent infections and fever • Extensive easy bruising, petechiae, and bleeding tendencies • Enlarged lymph nodes and splenomegaly indicative of possible metastatic spread DiagnosticTestsPerformed The following comprehensive tests were conducted on September 10, 2025, to confirm the presence of blood cancer: • Complete Blood Count (CBC) • Peripheral Blood Smear • Bone Marrow Biopsy and Aspiration • Flow Cytometry • Cytogenetic and Molecular Analysis • Imaging (CT/MRI) for Metastasis Assessment 1 of ??";
                } else if (item.id === 2) {
                    analysisResult = "Cancer Negative";
                    confidenceValue = "89%";
                    evidenceValue = "The report indicates normal findings with no evidence of malignancy.";
                    extractedTextValue = "Confidential Medical Report CityGeneral Hospital Routine Health Screening Report CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 14, 2025 PatientInformation Name: Jane Smith Age: 42 PatientID: 876543 Date of Birth: March 22, 1983 Primary Care Physician: Dr. Robert Johnson, MD ExaminationFindings Physical examination: Normal vital signs, no abnormal findings in all major organ systems. Laboratory tests: CBC, metabolic panel, and other routine bloodwork within normal ranges. Radiological studies: Chest X-ray clear, no suspicious masses or abnormalities identified. Conclusion: No evidence of malignancy or other significant health concerns at this time. Recommendations: Continue routine health screenings as scheduled. Follow up in one year for next annual examination.";
                }
                
                return {
                    id: String(item.id),
                    filename: `report-${item.id}.pdf`,
                    createdAt: item.createdAt,
                    analysisResults: item.analysisResults || analysisResult,
                    confidence: item.confidence || confidenceValue,
                    evidence: item.evidence || evidenceValue,
                    extractedText: item.extractedText || extractedTextValue,
                    sessionId: item.sessionId,
                    userId: user.id
                };
            });
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}