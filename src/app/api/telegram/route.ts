import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/app/lib/telegram';

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  try {
    // Parse request body
    const data = await request.json();

    if (!data.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Send to Telegram
    const telegramResult = await sendTelegramMessage(data.message);

    if (!telegramResult.success) {
      console.error('Failed to send Telegram message:', telegramResult.error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Telegram message error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
