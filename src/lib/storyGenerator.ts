
import { Character, StoryChapter } from "../types/story";
import { generateInitialStory, generateStoryStructure, generateOutline } from "./story/storyGeneration";
import { generateImagePrompts, generateImage } from "./story/imageGeneration";
import { parseChapters } from "./story/storyUtils";

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
