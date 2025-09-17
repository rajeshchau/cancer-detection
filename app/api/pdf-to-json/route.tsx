import { NextRequest, NextResponse } from "next/server";
import { PdfReader } from "pdfreader";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    let textByPage: Record<string, string[]> = {};
    let pageIndex = 1;

    return new Promise((resolve) => {
      new PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) {
          resolve(NextResponse.json({ error: err }, { status: 500 }));
        } else if (!item) {
          resolve(NextResponse.json(textByPage));
        } else if (item.page) {
          pageIndex = item.page;
          textByPage[`page_${pageIndex}`] = [];
        } else if (item.text) {
          textByPage[`page_${pageIndex}`].push(item.text);
        }
      });
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
