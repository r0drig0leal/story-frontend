
import { StoryChapter } from "../../types/story";

export const parseChapters = (story: string, imagePrompts: string): StoryChapter[] => {
  const chapters = story.split(/Capítulo \d+:/).filter(Boolean);
  const prompts = imagePrompts.split(/Capítulo \d+:/).filter(Boolean);

  return chapters.map((content, index) => ({
    chapter: index + 1,
    content: content.trim(),
    imagePrompt: prompts[index]?.trim() || "",
  }));
};
