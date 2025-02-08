
import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  const characterDescription = `A ${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'} named ${character.name} with ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.skinColor} skin, and ${character.bodyType} body type`;
  
  const messages = [
    {
      role: "system",
      content: "You are a creative image prompt generator for children's books. Generate safe, child-friendly prompts that maintain character consistency.",
    },
    {
      role: "user",
      content: `Create child-friendly image prompts for a children's story based on this outline: ${outline}. 
      The main character must remain consistent in all images with these characteristics: ${characterDescription}.
      Each prompt should focus on different scenarios and backgrounds while keeping the character's appearance, clothing style, and overall look consistent across all scenes.
      Each prompt must start with the character description.
      Use a Pixar-like, digital art style. Format in English.`,
    },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateImage = async (prompt: string, character: Character, apiKey: string): Promise<string> => {
  const characterDescription = `A ${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'} with ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.skinColor} skin, and ${character.bodyType} body type`;
  
  const safePrompt = `Create a Pixar-style children's book illustration. ${characterDescription}. Scene: ${prompt}. Cute, child-friendly, digital art style.`;
  
  return generateDallEImage(safePrompt, apiKey);
};
