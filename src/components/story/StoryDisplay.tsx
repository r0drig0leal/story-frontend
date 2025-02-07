
import { StoryChapter } from "@/types/story";

interface StoryDisplayProps {
  initial?: string;
  structure?: string;
  outline?: string;
  imagePrompts?: string;
  chapters?: StoryChapter[];
}

export const StoryDisplay = ({ initial, structure, outline, imagePrompts, chapters }: StoryDisplayProps) => {
  if (!initial && !structure && !outline && !imagePrompts && !chapters) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-teal-400 bg-clip-text text-transparent">
        História Gerada
      </h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold">História Inicial</h3>
          <p className="whitespace-pre-wrap">{initial}</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold">Estrutura</h3>
          <p className="whitespace-pre-wrap">{structure}</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold">Outline</h3>
          <div className="space-y-4">
            {chapters?.map((chapter, index) => (
              <div key={index} className="border-l-4 border-rose-400 pl-4">
                <h4 className="font-semibold">Capítulo {chapter.chapter}</h4>
                <p className="whitespace-pre-wrap mb-4">{chapter.content}</p>
                {chapter.image && (
                  <img
                    src={chapter.image}
                    alt={`Ilustração do capítulo ${chapter.chapter}`}
                    className="rounded-lg shadow-md w-full h-auto mb-4"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold">Prompts de Imagem</h3>
          <p className="whitespace-pre-wrap">{imagePrompts}</p>
        </section>
      </div>
    </div>
  );
};
