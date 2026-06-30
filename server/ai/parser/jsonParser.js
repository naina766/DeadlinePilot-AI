export const parseJsonResponse = (text) => {
  if (!text) return null;
  
  let cleaned = text.trim();
  
  // Strip markdown code blocks if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '');
    cleaned = cleaned.replace(/\n```$/, '');
    cleaned = cleaned.trim();
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Error parsing JSON response from Gemini:', err.message, '\nResponse was:', text);
    throw new Error('Failed to parse AI response as JSON');
  }
};
