
import { Character, Story } from "../types/story";

const generateInitialStory = async (character: Character, apiKey: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative children's book writer.",
        },
        {
          role: "user",
          content: `vou criar um livro sobre uma historia para crianças até 3 anos de idade, de modo ludico, quero criar algo inovador, detalhista e que prenda a atenção do espectador. O personagem principal tem as seguintes características: Nome: ${character.name}, Idade: ${character.age}, Cor dos olhos: ${character.eyeColor}, Cor do cabelo: ${character.hairColor}, Cor da pele: ${character.skinColor}, Biotipo: ${character.bodyType}. 

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
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateStoryStructure = async (initialStory: string, apiKey: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative children's book writer.",
        },
        {
          role: "user",
          content: `Com base nesta história: ${initialStory}, crie uma estrutura detalhada seguindo o formato fornecido.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateOutline = async (structure: string, apiKey: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative children's book writer.",
        },
        {
          role: "user",
          content: `Com base nesta estrutura: ${structure}, elabore um outline detalhado para a história, incluindo uma breve descrição de cada capítulo. O roteiro final deve ter cerca de 1000 palavras.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateImagePrompts = async (outline: string, apiKey: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative image prompt generator.",
        },
        {
          role: "user",
          content: `Com base neste outline: ${outline}, gere prompts de imagem no formato 16:9 para cada capítulo, seguindo o estilo Pixar e em inglês.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateCompleteStory = async (character: Character, apiKey: string): Promise<{
  initial: string;
  structure: string;
  outline: string;
  imagePrompts: string;
}> => {
  const initial = await generateInitialStory(character, apiKey);
  const structure = await generateStoryStructure(initial, apiKey);
  const outline = await generateOutline(structure, apiKey);
  const imagePrompts = await generateImagePrompts(outline, apiKey);

  return {
    initial,
    structure,
    outline,
    imagePrompts,
  };
};
