import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only HTML files are allowed.' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();

    // Return file data
    return NextResponse.json({
      name: file.name,
      content,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'HTML File Upload API',
    endpoints: {
      upload: 'POST /api/html-files',
    },
  });
}
