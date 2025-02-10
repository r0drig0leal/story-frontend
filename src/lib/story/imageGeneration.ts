
import { Character } from "../../types/story";
import { generateDallEImage } from "../openai/api";

export const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
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

  return callOpenAIChat(messages, apiKey);
};

export const generateImage = async (prompt: string, character: Character, apiKey: string): Promise<string> => {
  const sceneText = prompt.split(':')[1]?.trim() || prompt;
  const limitedText = sceneText.split(' ').slice(0, 15).join(' ');
  
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
