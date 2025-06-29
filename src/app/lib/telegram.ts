interface TelegramResponse {
  success: boolean;
  error?: string;
}

export async function sendTelegramMessage(message: string): Promise<TelegramResponse> {
  try {
    const botToken = '7744943079:AAFg4BPDtCDpaRk65jTUPKiB_WCac02UHZ4';
    const chatId = '-1002811490880';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description || 'Telegram API error' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
