import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";

async function seedDatabase() {
    try {
        // Insert records using your simplified schema (id, sessionId, report, createdAt)
        await db.insert(SessionChatTable).values([
            {
                sessionId: "1758049535339",
                report: {
                    analysisResults: "Cancer Positive",
                    confidence: "92%",
                    evidence: "The report explicitly labels the diagnostic report as \"Hematological Malignancy (Blood Cancer)\" and describes the patient presenting with advanced symptoms highly suggestive of a malignant hematological disorder, along with a comprehensive work‑up (CBC, peripheral smear, bone marrow biopsy, flow cytometry, cytogenetics, and imaging) performed to confirm blood cancer.",
                    extractedText: "Confidential Medical Report CityGeneral Hospital DiagnosticReport: Hematological Malignancy (Blood Cancer) CityGeneral Hospital 1234Health Street, Medical City, MC 56789 Date: September 16, 2025 PatientInformation Name: John Doe Age: 45 PatientID: 987654 Date of Birth: January 15, 1980 Referring Physician: Dr. Emily Carter, MD ClinicalPresentation The patient presented with advanced symptoms highly suggestive of a malignant hematological disorder, including: • Severe persistent fatigue and profound weakness • Significant unexplained weight loss (15 kg over 2 months) • Frequent recurrent infections and fever • Extensive easy bruising, petechiae, and bleeding tendencies • Enlarged lymph nodes and splenomegaly indicative of possible metastatic spread DiagnosticTestsPerformed The following comprehensive tests were conducted on September 10, 2025, to confirm the presence of blood cancer: • Complete Blood Count (CBC) • Peripheral Blood Smear • Bone Marrow Biopsy and Aspiration • Flow Cytometry • Cytogenetic and Molecular Analysis • Imaging (CT/MRI) for Metastasis Assessment 1 of ??"
                },
                createdAt: "2025-09-16T19:05:35.339Z"
            },
            {
                sessionId: "test-negative-1",
                report: {
                    analysisResults: "Cancer Negative",
                    confidence: "89%",
                    evidence: "All examined tissue samples show benign characteristics with no evidence of malignancy.",
                    extractedText: "Routine health screening report showing normal findings across all parameters."
                },
                createdAt: "2025-09-27T09:00:00.000Z"
            },
            {
                sessionId: "test-processing-1",
                report: {
                    analysisResults: "Processing",
                    confidence: "0%",
                    evidence: "Document analysis currently in progress.",
                    extractedText: "Medical document uploaded and queued for AI analysis."
                },
                createdAt: "2025-09-27T11:00:00.000Z"
            }
        ]);
        console.log("Test records inserted successfully.");
    } catch (error) {
        console.error("Error inserting test records:", error);
    }
}

seedDatabase();