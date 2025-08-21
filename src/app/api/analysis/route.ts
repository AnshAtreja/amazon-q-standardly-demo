import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('upload_id');

    if (!uploadId) {
      return NextResponse.json({ error: 'Upload ID required' }, { status: 400 });
    }

    const response = await fetch(`https://ziv9tm501c.execute-api.us-east-1.amazonaws.com/test/analysis?upload_id=${uploadId}`, {
      method: 'GET',
      headers: {
        'x-api-key': '1f3yK2q4wb76FH8LAnep77JvUMu3vwVy6MkWxzUH'
      }
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}