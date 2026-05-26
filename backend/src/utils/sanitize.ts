/**
 * Utility to securely extract, clean, and parse JSON returned from Gemini API.
 */
export function sanitizeJson(rawText: string): Record<string, string> {
  let cleaned = rawText.trim();

  // Remove markdown code blocks if present
  if (cleaned.startsWith("```")) {
    // Match both ```json ... ``` and ``` ... ```
    const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }

  // Double check if there are lingering code block markers
  cleaned = cleaned.replace(/^```json/gi, "").replace(/```$/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // If standard JSON parsing fails, try to extract the first { and last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch (innerError) {
        console.error("Failed to parse extracted JSON block:", innerError);
      }
    }
    
    throw new Error("Unable to parse Gemini output as structured JSON. Raw text: " + rawText);
  }
}
