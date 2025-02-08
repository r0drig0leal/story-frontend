import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  const characterDescription = `A ${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'} named ${character.name} with ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.skinColor} skin, and ${character.bodyType} body type`;
  
  const messages = [
    {
      role: "system",
      content: "You are a creative image prompt generator for children's books. Generate short, concise, child-friendly prompts.",
    },
    {
      role: "user",
      content: `Create brief, child-friendly scene descriptions for a children's story. 
      Main character: ${characterDescription}.
      Story outline: ${outline}
      Keep each prompt under 100 words and focus on one key scene element.
      Format as "Chapter X: [brief scene description]"
      Use simple, clear language.`,
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
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate image prompts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateImage = async (prompt: string, character: Character, apiKey: string): Promise<string> => {
  // Create a very concise character description
  const characterDesc = `${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'} with ${character.hairColor} hair`;
  
  // Keep the prompt short and focused, limiting to 50 words for safer DALL-E compatibility
  const promptText = prompt.split(':')[1]?.slice(0, 50) || prompt.slice(0, 50);
  const safePrompt = `Pixar-style children's illustration. ${characterDesc}. ${promptText}. Digital art style, child-friendly.`;
  
  return generateDallEImage(safePrompt, apiKey);
};
