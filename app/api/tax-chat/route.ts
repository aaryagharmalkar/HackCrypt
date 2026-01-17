import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = "https://aaryagharmalkar.app.n8n.cloud/webhook/a7fbffba-57fe-4f9c-80c2-1d0d9707467c/chat";

// Mock response for when webhook is unavailable
const getMockResponse = (chatInput: string): string => {
    const input = chatInput.toLowerCase();
    
    if (input.includes('deduction') || input.includes('80c')) {
        return "Under Section 80C, you can claim deductions up to ₹1.5 lakh for investments in PPF, ELSS, life insurance premiums, EPF, and home loan principal repayment. This helps reduce your taxable income significantly.";
    } else if (input.includes('itr') || input.includes('file')) {
        return "To file your ITR, you'll need Form 16, bank statements, investment proofs, and TDS certificates. You can file online through the Income Tax e-filing portal. The deadline for FY 2025-26 is July 31, 2026.";
    } else if (input.includes('tax') && input.includes('save')) {
        return "To save taxes, consider: 1) Maximizing 80C deductions (₹1.5L), 2) Claiming HRA exemption, 3) Investing in NPS (additional ₹50k deduction), 4) Medical insurance under 80D, and 5) Home loan interest under 24(b).";
    } else if (input.includes('capital gain')) {
        return "Short-term capital gains (held <1 year) are taxed at 15% for equity and at your slab rate for other assets. Long-term gains (>1 year) on equity above ₹1 lakh are taxed at 10%. For property, it's 20% with indexation benefit.";
    } else {
        return "I can help you with tax deductions, ITR filing, tax-saving strategies, and capital gains. Feel free to ask specific questions about Indian taxation!";
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log("Sending request to n8n webhook...");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "sendMessage",
                    sessionId: body.sessionId || "tax-chat-session",
                    chatInput: body.chatInput,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            console.log("N8N Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("N8N Error response:", errorText);
                throw new Error(`N8N API error: ${response.status}`);
            }

            const data = await response.json();
            console.log("N8N Response data:", data);
            
            return NextResponse.json(data);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            console.warn("N8N webhook unavailable, using mock response:", fetchError);
            
            // Fallback to mock response
            return NextResponse.json({
                output: getMockResponse(body.chatInput),
                text: getMockResponse(body.chatInput),
                message: getMockResponse(body.chatInput),
            });
        }
    } catch (error) {
        console.error("Tax chat API error:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Failed to process chat request",
                details: String(error)
            },
            { status: 500 }
        );
    }
}
