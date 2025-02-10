
import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  // Simplified character description
  const characterDescription = `child with ${character.hairColor} hair`;
  
  const messages = [
    {
      role: "system",
      content: "You are a friendly children's book illustrator. Create simple, safe, family-friendly image descriptions. Keep each prompt under 20 words.",
    },
    {
      role: "user",
      content: `Create simple scene descriptions for a children's picture book.
      Character: ${characterDescription}
      Story: ${outline}
      Rules:
      - Keep each prompt under 20 words
      - Use only child-friendly elements
      - Format as "Chapter X: [scene]"
      - Focus on positive emotions`,
    },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages,
      max_tokens: 250,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate image prompts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateImage = async (prompt: string, character: Character, apiKey: string): Promise<string> => {
  // Extract just the scene description after the colon
  const sceneText = prompt.split(':')[1]?.trim() || prompt;
  
  // Limit to 15 words maximum
  const limitedText = sceneText.split(' ').slice(0, 15).join(' ');
  
  // Create a safe, simple prompt
  const safePrompt = `Children's book illustration: ${limitedText}. Gentle, friendly style.`;
  
  return generateDallEImage(safePrompt, apiKey);
};
