
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Character, StoryChapter } from "@/types/story";
import { generateCompleteStory } from "@/lib/storyGenerator";
import { useToast } from "@/components/ui/use-toast";
import { CharacterForm } from "@/components/story/CharacterForm";
import { StoryDisplay } from "@/components/story/StoryDisplay";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [character, setCharacter] = useState<Character>({
    name: "",
    age: 0,
    gender: "",
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    bodyType: "",
    context: "",
  });
  const [story, setStory] = useState<{
    initial?: string;
    structure?: string;
    outline?: string;
    imagePrompts?: string;
    chapters?: StoryChapter[];
  }>({});

  const [apiKey, setApiKey] = useState("");

  const startLoadingAnimation = () => {
    setProgress(0);
    return setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return 95;
        }
        return prev + 1;
      });
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua chave da API OpenAI",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const loadingInterval = startLoadingAnimation();
    
    try {
      const result = await generateCompleteStory(character, apiKey);
      setStory(result);
      setProgress(100);
      toast({
        title: "Sucesso",
        description: "História gerada com sucesso!",
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Erro",
        description: error.message || "Houve um erro ao gerar a história. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API OpenAI</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full"
              />
            </div>

            <CharacterForm 
              character={character}
              onCharacterChange={setCharacter}
            />

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-400 to-teal-400 hover:from-rose-500 hover:to-teal-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Gerando História..." : "Gerar História"}
              </Button>

              {isLoading && (
                <div className="space-y-2 animate-fade-in">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-gray-500">
                    Criando sua história mágica... {progress}%
                  </p>
                </div>
              )}
            </div>
          </form>
        </Card>

        {Object.keys(story).length > 0 && (
          <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl space-y-6 animate-in slide-in-from-bottom duration-700">
            <StoryDisplay {...story} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
