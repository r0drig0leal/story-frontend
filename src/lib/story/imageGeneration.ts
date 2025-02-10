
import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  // Criar uma descrição mais detalhada do personagem usando todas as características
  const characterDescription = `${character.age} anos de idade, ${character.gender.toLowerCase()} com cabelo ${character.hairColor.toLowerCase()}, olhos ${character.eyeColor.toLowerCase()}, pele ${character.skinColor.toLowerCase()}, ${character.bodyType.toLowerCase()}`;
  
  const messages = [
    {
      role: "system",
      content: "Você é um ilustrador de livros infantis. Crie descrições de cenas simples e seguras para crianças. Mantenha cada cena com no máximo 15 palavras.",
    },
    {
      role: "user",
      content: `Crie cenas adoráveis para um livro infantil.
      Personagem Principal: ${characterDescription}
      História: ${outline}
      Regras:
      - Use linguagem simples e infantil
      - Mantenha cada cena com no máximo 15 palavras
      - Foque em emoções positivas
      - Formate como "Capítulo X: [cena]"
      - Mantenha as cenas amigáveis e alegres`,
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
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao gerar prompts de imagem: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateImage = async (prompt: string, character: Character, apiKey: string): Promise<string> => {
  // Extrair apenas a descrição da cena após os dois pontos
  const sceneText = prompt.split(':')[1]?.trim() || prompt;
  
  // Limitar a 15 palavras
  const limitedText = sceneText.split(' ').slice(0, 15).join(' ');
  
  // Criar um prompt seguro e amigável usando as características do personagem
  const characterDesc = `${character.gender.toLowerCase()} de ${character.age} anos com cabelo ${character.hairColor.toLowerCase()}`;
  const safePrompt = `Ilustração infantil estilo aquarela: ${characterDesc} em uma cena gentil - ${limitedText}`;
  
  return generateDallEImage(safePrompt, apiKey);
};
