import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const upload = data.get('file');
    if (!(upload instanceof File)) return NextResponse.json({error:'Select a file first.'},{status:400});
    if (upload.size > 10 * 1024 * 1024) return NextResponse.json({error:'Maximum file size is 10 MB.'},{status:400});
    const filename = upload.name.toLowerCase();
    const buffer = Buffer.from(await upload.arrayBuffer());
    let text = '';
    if (filename.endsWith('.pdf')) {
      const pdf = (await import('pdf-parse')).default;
      text = (await pdf(buffer)).text;
    } else if (filename.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({buffer})).value;
    } else if (filename.endsWith('.txt') || filename.endsWith('.md')) {
      text = buffer.toString('utf8');
    } else return NextResponse.json({error:'Supported files: PDF, DOCX, TXT and MD.'},{status:400});
    text = text.trim();
    if (!text) return NextResponse.json({error:'No selectable text found. Scanned PDFs need OCR before uploading.'},{status:422});
    return NextResponse.json({text:text.slice(0,75000), truncated:text.length>75000});
  } catch (e) { console.error(e); return NextResponse.json({error:'Could not read this file. Try pasting the text instead.'},{status:500}); }
}
