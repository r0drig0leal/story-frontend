
import { Character } from "../../types/story";
import { callOpenAIChat } from "../openai/api";

export const generateInitialStory = async (character: Character, apiKey: string): Promise<string> => {
  const messages = [
    {
      role: "system",
      content: "You are a creative children's book writer.",
    },
    {
      role: "user",
      content: `vou criar um livro sobre uma historia para crianças até 3 anos de idade, de modo ludico, quero criar algo inovador, detalhista e que prenda a atenção do espectador. 
      
      O personagem principal tem as seguintes características: 
      Nome: ${character.name}
      Gênero: ${character.gender}
      Idade: ${character.age}
      Cor dos olhos: ${character.eyeColor}
      Cor do cabelo: ${character.hairColor}
      Cor da pele: ${character.skinColor}
      Biotipo: ${character.bodyType}
      
      Contexto da história: ${character.context}

      Por favor, forneça:
      (Qual o titulo chamativo da historia?)
      (Qual o gancho inicial?)
      (Qual a contextualização?)
      (Qual o problema ou conflito principal?)
      (Qual a escalada de tensão?)
      (Qual o ponto de virada?)
      (Qual o clímax?)
      (Qual o fim surpreendente?)
      (Qual o tom da comunicação?)
      (A Narração/comunicação é em primeira ou terceira pessoa?)`,
    },
  ];

  return callOpenAIChat(messages, apiKey);
};

export const generateStoryStructure = async (initialStory: string, apiKey: string): Promise<string> => {
  const messages = [
    {
      role: "system",
      content: "You are a creative children's book writer.",
    },
    {
      role: "user",
      content: `Com base nesta história: ${initialStory}, crie uma estrutura detalhada seguindo o formato fornecido.`,
    },
  ];

  return callOpenAIChat(messages, apiKey);
};

export const generateOutline = async (outline: string, apiKey: string): Promise<string> => {
  const messages = [
    {
      role: "system",
      content: "You are a creative children's book writer.",
    },
    {
      role: "user",
      content: `Com base nesta estrutura: ${outline}, elabore um outline detalhado para a história, incluindo uma breve descrição de cada capítulo. O roteiro final deve ter cerca de 1000 palavras.`,
    },
  ];

  return callOpenAIChat(messages, apiKey);
};
