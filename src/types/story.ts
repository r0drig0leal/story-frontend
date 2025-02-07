
export interface Character {
  name: string;
  age: number;
  eyeColor: string;
  hairColor: string;
  skinColor: string;
  bodyType: string;
}

export interface StoryChapter {
  chapter: number;
  content: string;
  imagePrompt: string;
}

export interface Story {
  title: string;
  hook: string;
  context: string;
  conflict: string;
  tension: string;
  turningPoint: string;
  climax: string;
  ending: string;
  tone: string;
  narration: string;
  chapters: StoryChapter[];
}
