
import { Character, Story, StoryChapter } from "../types/story";

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

const generateOutline = async (outline: string, apiKey: string): Promise<string> => {
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
          content: `Com base nesta estrutura: ${outline}, elabore um outline detalhado para a história, incluindo uma breve descrição de cada capítulo. O roteiro final deve ter cerca de 1000 palavras.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateImagePrompts = async (outline: string, character: Character, apiKey: string): Promise<string> => {
  const characterDescription = `A ${character.age} year old ${character.gender.toLowerCase()} named ${character.name} with ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.skinColor} skin, and ${character.bodyType} body type`;
  
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
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateImage = async (prompt: string, character: Character, apiKey: string): Promise<string> => {
  const characterDescription = `A ${character.age} year old ${character.gender === 'Masculino' ? 'boy' : 'girl'} with ${character.hairColor} hair, ${character.eyeColor} eyes, ${character.skinColor} skin, and ${character.bodyType} body type`;
  
  const safePrompt = `Create a Pixar-style children's book illustration. ${characterDescription}. Scene: ${prompt}. Cute, child-friendly, digital art style.`;
  
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: safePrompt,
        size: "1792x1024",
        quality: "standard",
        style: "natural",
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Image generation error:', errorData);
      throw new Error(`Failed to generate image: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
};

const parseChapters = (outline: string, imagePrompts: string): StoryChapter[] => {
  const chapters = outline.split(/Capítulo \d+/).filter(Boolean);
  const prompts = imagePrompts.split(/Chapter \d+/).filter(Boolean);

  return chapters.map((content, index) => ({
    chapter: index + 1,
    content: content.trim(),
    imagePrompt: prompts[index]?.trim() || "",
  }));
};

export const generateCompleteStory = async (character: Character, apiKey: string): Promise<{
  initial: string;
  structure: string;
  outline: string;
  imagePrompts: string;
  chapters: StoryChapter[];
}> => {
  const initial = await generateInitialStory(character, apiKey);
  const structure = await generateStoryStructure(initial, apiKey);
  const outline = await generateOutline(structure, apiKey);
  const imagePrompts = await generateImagePrompts(outline, character, apiKey);
  
  const chapters = parseChapters(outline, imagePrompts);
  
  for (const chapter of chapters) {
    try {
      chapter.image = await generateImage(chapter.imagePrompt, character, apiKey);
    } catch (error) {
      console.error(`Error generating image for chapter ${chapter.chapter}:`, error);
    }
  }

  return {
    initial,
    structure,
    outline,
    imagePrompts,
    chapters,
  };
};
