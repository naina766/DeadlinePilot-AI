const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface ChatResponse {
  reply: string;
  suggestedActions: any[];
}

export const sendChatMessage = async (
  message: string, 
  token: string, 
  timezoneOffset: number = new Date().getTimezoneOffset()
): Promise<ChatResponse> => {
  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message, timezoneOffset })
  });

  if (!response.ok) {
    throw new Error('Failed to send chat message');
  }

  return response.json();
};
