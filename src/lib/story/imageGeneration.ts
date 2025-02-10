
import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  // Criar uma descrição detalhada e consistente do personagem no estilo Pixar
  const characterDescription = `
    ${character.age} anos de idade, ${character.gender.toLowerCase()}, 
    estilo animação Pixar 3D com traços suaves e expressivos,
    cabelo ${character.hairColor.toLowerCase()} bem definido e brilhante, 
    olhos ${character.eyeColor.toLowerCase()} grandes e expressivos,
    pele ${character.skinColor.toLowerCase()} com textura suave,
    ${character.bodyType.toLowerCase()},
    vestindo uma camiseta azul marinho (#0EA5E9),
    calça em tom pastel (#E5DEFF),
    tênis em tons de roxo claro (#D6BCFA)
  `.replace(/\s+/g, ' ').trim();
  
  const messages = [
    {
      role: "system",
      content: "Você é um diretor de arte da Pixar. Crie descrições de cenas mantendo o estilo visual Pixar consistente, com iluminação suave e cores vibrantes. Mantenha cada cena com no máximo 15 palavras.",
    },
    {
      role: "user",
      content: `Crie cenas adoráveis no estilo Pixar.
      Personagem Principal: ${characterDescription}
      História: ${outline}
      Regras:
      - Use linguagem simples e infantil
      - Mantenha cada cena com no máximo 15 palavras
      - Mantenha o estilo visual Pixar consistente
      - Formate como "Capítulo X: [cena]"
      - Use iluminação suave e cores vibrantes
      - Mantenha as mesmas roupas e características em todas as cenas`,
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
  
  // Criar um prompt detalhado no estilo Pixar com as características consistentes
  const characterStyle = `
    ${character.gender.toLowerCase()} de ${character.age} anos estilo Pixar 3D,
    cabelo ${character.hairColor.toLowerCase()} brilhante e definido,
    olhos ${character.eyeColor.toLowerCase()} grandes e expressivos,
    pele ${character.skinColor.toLowerCase()} com textura suave,
    ${character.bodyType.toLowerCase()},
    usando camiseta azul marinho, calça em tom pastel e tênis roxo claro
  `.replace(/\s+/g, ' ').trim();

  const safePrompt = `Ilustração estilo Pixar 3D: ${characterStyle} em uma cena gentil e alegre - ${limitedText}. 
    Iluminação suave, cores vibrantes, alto nível de detalhe e expressividade facial.`.slice(0, 1000);
  
  return generateDallEImage(safePrompt, apiKey);
};

