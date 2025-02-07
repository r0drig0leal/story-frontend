
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FORM_OPTIONS } from "@/lib/constants";
import { Character } from "@/types/story";

interface CharacterFormProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export const CharacterForm = ({ character, onCharacterChange }: CharacterFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Personagem</Label>
        <Input
          id="name"
          value={character.name}
          onChange={(e) => onCharacterChange({ ...character, name: e.target.value })}
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
          onChange={(e) => onCharacterChange({ ...character, age: parseInt(e.target.value) })}
          placeholder="Idade"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Cor dos Olhos</Label>
        <Select onValueChange={(value) => onCharacterChange({ ...character, eyeColor: value })}>
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
        <Select onValueChange={(value) => onCharacterChange({ ...character, hairColor: value })}>
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
        <Select onValueChange={(value) => onCharacterChange({ ...character, skinColor: value })}>
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
        <Select onValueChange={(value) => onCharacterChange({ ...character, bodyType: value })}>
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
  );
};
