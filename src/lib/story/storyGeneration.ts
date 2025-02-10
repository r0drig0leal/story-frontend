
import { Character } from "../../types/story";
import { callOpenAIChat } from "../openai/api";

export const generateInitialStory = async (character: Character, apiKey: string): Promise<string> => {
  const messages = [
    {
      role: "system",
      content: "Você é um roteirista da Pixar especializado em histórias infantis para crianças até 3 anos.",
    },
    {
      role: "user",
      content: `Crie uma história infantil curta e mágica, dividida em 5 capítulos. 
      Cada capítulo deve ter no máximo 3 parágrafos curtos.
      
      O personagem principal tem as seguintes características: 
      Nome: ${character.name}
      Gênero: ${character.gender}
      Idade: ${character.age}
      Cor dos olhos: ${character.eyeColor}
      Cor do cabelo: ${character.hairColor}
      Cor da pele: ${character.skinColor}
      Biotipo: ${character.bodyType}
      
      Contexto da história: ${character.context}
      
      Formate a saída como:
      Título: [título mágico e chamativo]
      
      Capítulo 1: [título do capítulo]
      [conteúdo]
      
      Capítulo 2: [título do capítulo]
      [conteúdo]
      
      [e assim por diante...]
      `,
    },
  ];

  return callOpenAIChat(messages, apiKey);
};

