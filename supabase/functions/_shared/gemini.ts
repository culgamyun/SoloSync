const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';
const apiKey = Deno.env.get('GEMINI_API_KEY');

export async function generateJson<T>(systemPrompt: string, payload: unknown, fallback: T): Promise<T> {
  if (!apiKey) {
    return fallback;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${JSON.stringify(payload)}` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    return fallback;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return fallback;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function generateText(systemPrompt: string, payload: unknown, fallback: string): Promise<string> {
  if (!apiKey) {
    return fallback;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${JSON.stringify(payload)}` }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    return fallback;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? fallback;
}
