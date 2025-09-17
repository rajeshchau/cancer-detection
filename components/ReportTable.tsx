'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Calendar, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  filename: string;
  createdAt: string;
  analysisResults: string;
  confidence: string;
  evidence: string;
  extractedText: string;
  sessionId: string;
  userId?: string;
  originalFilePath?: string;
  status?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function ReportTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Only fetch on client-side
        if (typeof window !== 'undefined') {
          const response = await axios.get('/api/data?sessionId=all');
          if (response.data) {
            setReports(response.data);
          }
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Using sample data instead.');
        // Provide fallback sample data
        setReports([
          {
            id: "1",
            filename: "sample-report-1.pdf",
            createdAt: new Date().toISOString(),
            analysisResults: "Cancer Positive",
            confidence: "92%",
            evidence: "The report explicitly labels the diagnostic report as \"Hematological Malignancy (Blood Cancer)\" and describes the patient presenting with advanced symptoms highly suggestive of a malignant hematological disorder.",
            extractedText: "Confidential Medical Report CityGeneral Hospital DiagnosticReport: Hematological Malignancy (Blood Cancer)",
            sessionId: "sample1",
            userId: 'sample-user'
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
            userId: 'sample-user'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
          <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600 mb-4">
            Upload a medical document to analyze it for cancer indicators
          </p>
          <Link href="/upload" passHref>
            <Button>Upload Document</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Filename</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Prediction</TableHead>
            <TableHead className="font-semibold">Confidence</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.filename}</TableCell>
              <TableCell>{formatDate(report.createdAt)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    report.analysisResults === 'Cancer Positive'
                      ? 'destructive'
                      : report.analysisResults === 'Cancer Negative'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {report.analysisResults || 'Processing'}
                </Badge>
              </TableCell>
              <TableCell>
                {report.confidence || 'N/A'}
              </TableCell>
              <TableCell>
                <Link href={`/reports/${report.id}`} passHref>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}