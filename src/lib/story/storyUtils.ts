
import { StoryChapter } from "../../types/story";

export const parseChapters = (outline: string, imagePrompts: string): StoryChapter[] => {
  const chapters = outline.split(/Capítulo \d+/).filter(Boolean);
  const prompts = imagePrompts.split(/Chapter \d+/).filter(Boolean);

  return chapters.map((content, index) => ({
    chapter: index + 1,
    content: content.trim(),
    imagePrompt: prompts[index]?.trim() || "",
  }));
};
