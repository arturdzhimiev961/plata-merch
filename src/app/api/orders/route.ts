import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/app/lib/telegram';
import { validateOrderData } from '@/app/lib/validation';
import { escapeHtml } from '@/app/lib/utils';

// Simple rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requestData = ipRequestCounts.get(ip);

  if (!requestData) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (now > requestData.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  requestData.count += 1;
  return false;
}

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: corsHeaders }
      );
    }

    // Parse request body
    const data = await request.json();

    // Validate the data
    const validationResult = validateOrderData(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Format the message for Telegram
    const { name, slackId, product, size, comment } = data;

    const message = `
<b>🛍 Новая заявка на мерч</b>

👤 <b>Имя:</b> ${escapeHtml(name)}
💬 <b>Slack ID:</b> ${escapeHtml(slackId)}
📦 <b>Товар:</b> ${escapeHtml(product)}
📏 <b>Размер:</b> ${escapeHtml(size)}
📝 <b>Комментарий:</b> ${comment ? escapeHtml(comment) : '—'}
    `.trim();

    // Send to Telegram
    const telegramResult = await sendTelegramMessage(message);

    if (!telegramResult.success) {
      console.error('Failed to send Telegram message:', telegramResult.error);
      return NextResponse.json(
        { error: 'Failed to process order. Please try again later.' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order submitted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
