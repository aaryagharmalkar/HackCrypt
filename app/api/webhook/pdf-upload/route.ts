import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { pdf_id, user_id, public_url, file_name } = body;
    
    if (!pdf_id || !user_id || !public_url || !file_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('API Route: Forwarding webhook request to n8n');
    console.log('Payload:', body);

    // Forward the request to the n8n webhook
    const webhookUrl = 'https://aaryagharmalkar.app.n8n.cloud/webhook-test/supabase-pdf-upload';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pdf_id,
        user_id,
        public_url,
        file_name
      })
    });

    const responseText = await response.text();
    console.log('n8n webhook response status:', response.status);
    console.log('n8n webhook response:', responseText);

    if (!response.ok) {
      console.error('n8n webhook returned error:', response.status);
      return NextResponse.json(
        { error: 'Webhook call failed', details: responseText },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Webhook triggered successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('API Route: Error triggering webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
