import { NameTranslation } from "../interfaces/Pokemon";

export type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export const statTranslations: Record<StatKey, string> = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defensa Especial",
  speed: "Velocidad",
};

export const getSpanishName = (names: NameTranslation[] | undefined): string => {
  return names?.find(n => n.language.name === "es")?.name || "";
};
