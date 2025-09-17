/**
 * Utility to determine if the current environment should use sample data
 * 
 * This helps ensure consistent behavior across all API routes
 */

/**
 * Check if the current environment should use sample data
 * This is true during build time or when running without authentication
 */
export function shouldUseSampleData(): boolean {
  // Check if we're in production build or if auth isn't configured
  return process.env.NODE_ENV === 'production' || 
         process.env.CLERK_PUBLISHABLE_KEY === undefined || 
         process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === undefined;
}

/**
 * Get sample report data for consistent use across the application
 */
export function getSampleReports(userId: string = 'sample-user') {
  return [
    {
      id: "1",
      filename: "sample-report-1.pdf",
      createdAt: new Date().toISOString(),
      analysisResults: "Cancer Positive",
      confidence: "92%",
      evidence: "The report explicitly labels the diagnostic report as \"Hematological Malignancy (Blood Cancer)\" and describes the patient presenting with advanced symptoms highly suggestive of a malignant hematological disorder.",
      extractedText: "Confidential Medical Report CityGeneral Hospital DiagnosticReport: Hematological Malignancy (Blood Cancer)",
      sessionId: "sample1",
      userId: userId
    },
    {
      id: "2",
      filename: "sample-report-2.pdf",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      analysisResults: "Cancer Negative",
      confidence: "89%",
      evidence: "The report indicates normal findings with no evidence of malignancy.",
      extractedText: "Confidential Medical Report CityGeneral Hospital Routine Health Screening Report",
      sessionId: "sample2",
      userId: userId
    }
  ];
}

/**
 * Get sample dashboard statistics for consistent use across the application
 */
export function getSampleDashboardStats() {
  return {
    totalReports: 2,
    cancerPositive: 1,
    averageConfidence: 90.5,
    timestamp: new Date().toISOString()
  };
}