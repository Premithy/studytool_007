/** Server-only Gemini API adapter. Never expose your key to the browser. */
export async function generateJSON(instructions: string, payload: unknown): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('SETUP_REQUIRED');
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instructions }] },
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(payload) }] }],
      generationConfig: { temperature: 0.25, responseMimeType: 'application/json' }
    }),
    signal: AbortSignal.timeout(55000)
  });
  if (!response.ok) {
    const details = await response.json().catch(() => ({})) as {error?:{message?:string}};
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (response.status === 400 || response.status === 403) throw new Error('INVALID_KEY');
    console.error('Gemini error', response.status, details.error?.message);
    throw new Error('PROVIDER_ERROR');
  }
  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||'').join('');
  if (!raw) throw new Error('EMPTY_RESPONSE');
  return JSON.parse(raw);
}
export function apiError(error: unknown): {error:string; status:number} {
  const reason = error instanceof Error ? error.message : '';
  if(reason==='SETUP_REQUIRED') return {error:'AI needs a Gemini API key. Add GEMINI_API_KEY to your server environment (see README).',status:503};
  if(reason==='RATE_LIMIT') return {error:'The free AI allowance has been reached. Please try again later.',status:429};
  if(reason==='INVALID_KEY') return {error:'Gemini API key is invalid or access is not enabled. Check the key in your hosting settings.',status:503};
  return {error:'The AI service could not finish this request. Try again.',status:502};
}
