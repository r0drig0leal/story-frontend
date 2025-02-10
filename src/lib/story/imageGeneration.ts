
import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  // Simplificando a descrição do personagem para ser mais concisa
  const characterDescription = `${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'} with ${character.hairColor} hair`;
  
  const messages = [
    {
      role: "system",
      content: "You are a creative image prompt generator for children's books. Generate brief, concise, child-friendly prompts. Each prompt must be under 50 words.",
    },
    {
      role: "user",
      content: `Create very short scene descriptions for a children's story. 
      Character: ${characterDescription}
      Story outline: ${outline}
      Important:
      - Each prompt must be under 50 words
      - Focus on one main scene element
      - Format as "Chapter X: [brief scene description]"
      - Use simple language`,
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
      max_tokens: 300,
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
  // Criando uma descrição muito concisa do personagem
  const characterDesc = `${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'}`;
  
  // Limitando o prompt a 25 palavras para garantir que não ultrapasse o limite
  const promptText = prompt.split(':')[1]?.trim().split(' ').slice(0, 25).join(' ') || 
                    prompt.split(' ').slice(0, 25).join(' ');
  
  // Criando um prompt final curto e focado
  const safePrompt = `Pixar-style children's art: ${characterDesc}. ${promptText}`;
  
  return generateDallEImage(safePrompt, apiKey);
};
