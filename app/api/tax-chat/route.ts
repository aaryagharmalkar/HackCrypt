import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = "https://kaustubh-karnik.app.n8n.cloud/webhook/03311070-2fa8-4276-bccb-e89dcc1723f0/chat";

// Clean markdown formatting from text
function cleanMarkdown(text: string): string {
    if (!text) return text;
    
    return text
        // Remove bold markdown (**text** or __text__)
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        // Remove italic markdown (*text* or _text_)
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        // Remove headers (# ## ### etc)
        .replace(/^#{1,6}\s+/gm, '')
        // Clean up any remaining stray * or #
        .replace(/[*#]/g, '')
        .trim();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const chatInput = body.chatInput || "";
        const sessionId = body.sessionId || `session-${Date.now()}`;
        const action = body.action || "sendMessage";
        
        console.log("=== N8N Request Debug ===");
        console.log("Webhook URL:", WEBHOOK_URL);
        console.log("Action:", action);
        console.log("Session ID:", sessionId);
        console.log("Chat Input:", chatInput);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        // Construct URL with action query parameter as n8n expects
        const webhookWithAction = `${WEBHOOK_URL}?action=${encodeURIComponent(action)}`;
        
        const response = await fetch(webhookWithAction, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatInput: chatInput,
                sessionId: sessionId,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("=== N8N Response ===");
        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("=== N8N ERROR DETAILS ===");
            console.error("Status:", response.status);
            console.error("Error Response Body:", errorText);
            
            // Try to parse error as JSON for better details
            let errorDetails = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorDetails = JSON.stringify(errorJson, null, 2);
                console.error("Parsed Error:", errorJson);
            } catch (e) {
                // Error is not JSON, use as-is
            }
            
            // Return user-friendly error
            return NextResponse.json(
                { 
                    error: response.status === 404 
                        ? "N8N workflow not found. Please ensure the workflow is activated in n8n."
                        : response.status === 500
                        ? "N8N workflow error. Check your workflow nodes, API keys, and connections in n8n."
                        : `N8N API error: ${response.status}`,
                    details: errorDetails,
                    status: response.status
                },
                { 
                    status: response.status,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    }
                }
            );
        }

        const data = await response.json();
        console.log("Success Response:", data);
        
        let output = data.output || data.text || data.message || data.response || 
                     (Array.isArray(data) && data[0]?.output) || 
                     (Array.isArray(data) && data[0]?.text);
        
        // Clean markdown formatting from the response
        if (output && typeof output === 'string') {
            output = cleanMarkdown(output);
        }
        
        return NextResponse.json(
            { output, text: output, message: output },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );
    } catch (error) {
        console.error("=== Tax Chat API Error ===");
        console.error(error);
        
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: "Request timeout - n8n workflow took too long to respond" },
                { status: 504 }
            );
        }
        
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Failed to process chat request",
                details: String(error)
            },
            { status: 500 }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
