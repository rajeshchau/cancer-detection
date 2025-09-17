import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface ReportRequestBody {
    sessionId: string;
    analysisResults?: "Cancer Positive" | "Cancer Negative";
    confidence?: string;
    evidence?: string;
    extractedText?: string;
    pdfContent?: Record<string, string[]>;
    createdAt?: string; // ISO Date string
}

const CANCER_ANALYSIS_PROMPT = `You are an advanced AI medical analysis agent tasked with analyzing a comprehensive JSON medical report to determine the likelihood of cancer. The JSON report contains fields such as patient notes, symptoms, conversation, diagnostic data, imaging results, and laboratory findings. Use all available methodologies, including keyword analysis, pattern recognition, and contextual understanding, to ensure high accuracy in your assessment.

Instructions:

1. Analyze the JSON input for medical indicators of cancer, including but not limited to:
    - Keywords: "tumor," "carcinoma," "malignant," "metastasis," "abnormal growth," "abnormal WBC," "blast cells," "suspicious MRI findings," "lesion," "neoplasm," "oncogenic markers."
    - Laboratory data: Abnormal blood counts, genetic markers (e.g., translocations, mutations), elevated tumor markers (e.g., CA-125, PSA).
    - Imaging results: Suspicious findings in MRI, CT, PET scans, or X-rays.
    - Pathology reports: Biopsy results, histopathological findings.

2. If the report contains strong evidence suggesting cancer (e.g., explicit mentions of cancer, abnormal cell counts, imaging findings, or genetic markers), set "analysisResults" to "Cancer Positive."

3. If no evidence of cancer is found, set "analysisResults" to "Cancer Negative."

4. Assign a "confidence" percentage as a string (e.g., "98%") based on the strength, clarity, and consistency of the evidence:
    - Use higher percentages for explicit cancer diagnoses or strong indicators (e.g., biopsy-confirmed malignancy, clear imaging findings).
    - Use lower percentages for ambiguous or inconclusive findings.

5. Provide an "evidence" field with a concise explanation of the decision, referencing specific findings in the report (e.g., "Presence of malignant cells in biopsy and suspicious lesion in MRI").

6. Include the "extractedText" field from the input JSON, if available. If not provided, use a summary of relevant report data or an empty string if no relevant text is found.

7. Preserve the original "sessionId" and "createdAt" fields from the input JSON. If these fields are missing, use "unknown" for "sessionId" and the current ISO timestamp for "createdAt."

Output JSON format: 
{
  "sessionId": "string",
  "analysisResults": "Cancer Positive" | "Cancer Negative",
  "confidence": "string",
  "evidence": "string",
  "extractedText": "string",
  "createdAt": "ISO Date string"
}

Constraints:
- Return only valid JSON.
- Do not include explanations, commentary, or any text outside the JSON output.
- Ensure the "confidence" field is a percentage string (e.g., "98%").
- Use all available data and methodologies to maximize accuracy in the analysis.
- If specific cancer-related terms or findings are ambiguous, base the decision on the overall context of the report.`;

export async function POST(REQ:NextRequest) {
    const body= await REQ.json();
  try{
        const completion = await openai.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: CANCER_ANALYSIS_PROMPT },
            { role: "user", content: `Analyze the following medical report JSON and provide the output strictly in the specified JSON format: ${JSON.stringify(body)}` }
          ],
        });
        const response = completion.choices[0].message.content;
        const newresponse = response ? response.trim().replace('```json','').replace('```','') : "";
        const JSONResp = JSON.parse(newresponse);
        // Parse the response to ensure it's valid JSON before sending
        // const parsedResponse = response ? JSON.parse(response) : [];
        try {
            await db.insert(SessionChatTable).values({
                sessionId: JSONResp.sessionId || body.sessionId || "unknown",
                report: JSON.stringify({
                    analysisResults: JSONResp.analysisResults || "Cancer Negative",
                    confidence: JSONResp.confidence || "0%",
                    evidence: JSONResp.evidence || "No significant findings",
                    extractedText: JSONResp.extractedText || body.extractedText || "",
                    sessionId: JSONResp.sessionId || body.sessionId || "unknown",
                    createdAt: JSONResp.createdAt || body.createdAt || new Date().toISOString()
                }),
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error inserting into database:", e);
            return NextResponse.json({ error: "Failed to save report to database" }, { status: 500 });
        }
        
        return NextResponse.json(JSONResp);



    }catch(error){
        return NextResponse.json(error);
    }

}