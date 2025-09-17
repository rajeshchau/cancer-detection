import { NextRequest, NextResponse } from "next/server";

// Use dynamic import for pdf-parse to avoid build-time execution
// This prevents the library from trying to access test files during build
let pdfParse: any = null;

// Only import the library in runtime environment, not during build
export const runtime = "nodejs"; // 👈 Important: use Node.js runtime

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Dynamically import pdf-parse only when the route is actually called
    if (!pdfParse) {
      const pdfParseModule = await import('pdf-parse');
      pdfParse = pdfParseModule.default;
    }

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdfParse(buffer);

    // Split by pages
    const pages = data.text.split("\f");
    const jsonData: Record<string, string> = {};

    pages.forEach((page: string, index: number) => {
      jsonData[`page_${index + 1}`] = page.trim();
    });

    return NextResponse.json(jsonData);
  } catch (e) {
    console.error("PDF processing error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
