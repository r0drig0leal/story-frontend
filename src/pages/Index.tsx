
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FORM_OPTIONS } from "@/lib/constants";
import { Character } from "@/types/story";
import { generateCompleteStory } from "@/lib/storyGenerator";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [character, setCharacter] = useState<Character>({
    name: "",
    age: 0,
    eyeColor: "",
    hairColor: "",
    skinColor: "",
    bodyType: "",
  });
  const [story, setStory] = useState<{
    initial?: string;
    structure?: string;
    outline?: string;
    imagePrompts?: string;
    images?: { [key: string]: string };
  }>({});

  const [apiKey, setApiKey] = useState("");

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
    try {
      const result = await generateCompleteStory(character, apiKey);
      setStory(result);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao gerar a história. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Personagem</Label>
                <Input
                  id="name"
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  placeholder="Nome"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={character.age || ""}
                  onChange={(e) => setCharacter({ ...character, age: parseInt(e.target.value) })}
                  placeholder="Idade"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Cor dos Olhos</Label>
                <Select onValueChange={(value) => setCharacter({ ...character, eyeColor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {FORM_OPTIONS.eyeColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor do Cabelo</Label>
                <Select onValueChange={(value) => setCharacter({ ...character, hairColor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {FORM_OPTIONS.hairColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor da Pele</Label>
                <Select onValueChange={(value) => setCharacter({ ...character, skinColor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {FORM_OPTIONS.skinColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Biotipo</Label>
                <Select onValueChange={(value) => setCharacter({ ...character, bodyType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {FORM_OPTIONS.bodyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-400 to-teal-400 hover:from-rose-500 hover:to-teal-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Gerando História..." : "Gerar História"}
            </Button>
          </form>
        </Card>

        {Object.keys(story).length > 0 && (
          <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl space-y-6 animate-in slide-in-from-bottom duration-700">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-teal-400 bg-clip-text text-transparent">
                História Gerada
              </h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold">História Inicial</h3>
                  <p className="whitespace-pre-wrap">{story.initial}</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold">Estrutura</h3>
                  <p className="whitespace-pre-wrap">{story.structure}</p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold">Outline</h3>
                  <div className="space-y-4">
                    {story.chapters?.map((chapter, index) => (
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
                  <p className="whitespace-pre-wrap">{story.imagePrompts}</p>
                </section>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
