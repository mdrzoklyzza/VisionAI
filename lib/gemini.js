import * as FileSystem from 'expo-file-system/legacy';

export async function imageToBase64(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
}

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export async function analyzeImage(base64Image, prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status}: ${errBody}`);
  }

  const json = await response.json();
  return json;
}

export const PROMPTS = {
  academic: `You are a university professor analyzing an image.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation before or after.

{
  "objects": ["list every visible object"],
  "context": "describe the educational setting or subject matter in 2-3 sentences",
  "activities": "describe what is happening or what this is used for academically",
  "recommendations": "give one constructive academic recommendation based on what you see"
}`,

  safety: `You are a workplace safety inspector analyzing an image.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation before or after.

{
  "objects": ["list every visible object"],
  "context": "describe the environment and overall safety situation in 2-3 sentences",
  "activities": "describe what activities are happening or likely to happen here",
  "recommendations": "give specific safety recommendations or state that the area appears safe"
}`,

  inventory: `You are an asset management clerk analyzing an image.

Return ONLY a raw JSON object. No markdown, no backticks, no explanation before or after.

{
  "objects": ["list every visible physical asset with brief description"],
  "context": "describe where these items are located and their general condition",
  "activities": "describe the likely purpose or use of these assets",
  "recommendations": "give inventory management recommendations such as labeling, storage, or maintenance"
}`,
};