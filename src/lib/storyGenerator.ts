
import { Character, StoryChapter } from "../types/story";
import { generateInitialStory } from "./story/storyGeneration";
import { generateImagePrompts, generateImage } from "./story/imageGeneration";
import { parseChapters } from "./story/storyUtils";

export const generateCompleteStory = async (character: Character, apiKey: string): Promise<{
  initial: string;
  chapters: StoryChapter[];
}> => {
  const initial = await generateInitialStory(character, apiKey);
  const imagePrompts = await generateImagePrompts(initial, character, apiKey);
  
  const chapters = parseChapters(initial, imagePrompts);
  
  for (const chapter of chapters) {
    try {
      chapter.image = await generateImage(chapter.imagePrompt, character, apiKey);
    } catch (error) {
      console.error(`Error generating image for chapter ${chapter.chapter}:`, error);
    }
  }

  return {
    initial,
    chapters,
  };
};
