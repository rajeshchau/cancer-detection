import { NextRequest, NextResponse } from "next/server";
import { PdfReader } from "pdfreader";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    let textByPage: Record<string, string[]> = {};
    let pageIndex = 1;

    return new Promise<Response>((resolve, reject) => {
      const pdfReader = new PdfReader();
      
      pdfReader.parseBuffer(buffer, (err, item) => {
        if (err) {
          resolve(NextResponse.json({ error: err }, { status: 500 }));
          return;
        } 
        
        if (!item) {
          // End of file - process complete
          resolve(NextResponse.json({ 
            success: true, 
            text: textByPage,
            // Also include concatenated text for easier processing
            extractedText: Object.values(textByPage)
              .map(lines => lines.join(' '))
              .join('\n\n')
          }));
          return;
        }
        
        if (item.page) {
          pageIndex = item.page;
          textByPage[`page_${pageIndex}`] = [];
        } else if (item.text) {
          if (!textByPage[`page_${pageIndex}`]) {
            textByPage[`page_${pageIndex}`] = [];
          }
          textByPage[`page_${pageIndex}`].push(item.text);
        }
      });
    });
  } catch (e) {
    console.error("PDF processing error:", e);
    return NextResponse.json({ 
      success: false,
      error: e instanceof Error ? e.message : String(e) 
    }, { status: 500 });
  }
}
