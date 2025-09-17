'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Loader2, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AnalysisResult {
  analysisResults: 'Cancer Positive' | 'Cancer Negative';
  confidence: string;
  evidence: string;
  extractedText: string;
  sessionId: string;
  createdAt: string;
}

export default function Upload() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // Removed unused uploadedFile state

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      console.log("Starting PDF upload process...");

      // Step 1: Upload and process PDF
      const formData = new FormData();
      formData.append('pdf', file);

      console.log("Sending PDF to /api/pdf-to-json...");
      const pdfResponse = await axios.post('/api/pdf-to-json', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("PDF Processing Response:", pdfResponse.data);

      if (!pdfResponse.data || typeof pdfResponse.data !== 'object') {
        throw new Error("Invalid PDF processing response: " + JSON.stringify(pdfResponse.data));
      }

      // Step 2: Send to AI for analysis
      const aiRequestData = {
        sessionId: new Date().getTime().toString(),
        createdAt: new Date().toISOString(),
        pdfContent: pdfResponse.data // Send the entire paginated content
      };

      console.log("Sending data to /api/report-generation...");
      const aiResponse = await axios.post('/api/report-generation', aiRequestData);

      console.log("AI Analysis Response:", aiResponse.data);

      if (!aiResponse.data) {
        throw new Error("Invalid AI analysis response: " + JSON.stringify(aiResponse.data));
      }

      // Step 3: Set the result for display
      const report = aiResponse.data;
      setResult({
        analysisResults: report.analysisResults,
        confidence: report.confidence,
        evidence: report.evidence,
        extractedText: report.extractedText || '',
        sessionId: report.sessionId,
        createdAt: report.createdAt
      });

    } catch (error) {
      console.error("Error during file upload or analysis:", error);
      
      // Get more detailed error information
      if (axios.isAxiosError(error)) {
        console.error("API Error Details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
      }
      
      setResult(null);
      
      // Display error to user (could add a UI element for this)
      alert(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Medical Report</h1>
            <p className="text-lg text-gray-600">
              Upload your PDF medical report for AI-powered cancer detection analysis
            </p>
          </div>

          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Report</h2>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

            {/* Analysis Section */}
            {(isAnalyzing || result) && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Results</h2>
                
                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Report</h3>
                    <p className="text-gray-600 text-center">
                      Our AI is processing your medical report. This may take a few moments.
                    </p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    {/* Prediction Result */}
                    <div className={`rounded-xl p-6 border-2 ${
                      result.analysisResults === 'Cancer Positive' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center mb-4">
                        {result.analysisResults === 'Cancer Positive' ? (
                          <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                        )}
                        <h3 className="text-xl font-semibold">
                          <span className={
                            result.analysisResults === 'Cancer Positive' 
                              ? 'text-red-800' 
                              : 'text-green-800'
                          }>
                            Analysis Result: {result.analysisResults}
                          </span>
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        <strong>Confidence:</strong> {result.confidence}
                      </p>
                      <p className="text-gray-700">
                        <strong>Evidence:</strong> {result.evidence}
                      </p>
                    </div>

                    {/* Extracted Text */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <FileText className="h-5 w-5 text-gray-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Extracted Text</h4>
                      </div>
                      <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                        <pre
                          className="whitespace-pre-wrap text-sm text-gray-700 font-mono"
                          dangerouslySetInnerHTML={{
                            __html: typeof result.extractedText === 'string'
                              ? result.extractedText.replace(
                                  /(carcinoma|malignant|metastasis|tumor|adenocarcinoma|invasive)/gi,
                                  (match) => `<mark class="bg-yellow-200 px-1 rounded">${match}</mark>`
                                )
                              : "No extracted text available",
                          }}
                        ></pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}