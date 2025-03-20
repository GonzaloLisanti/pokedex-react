export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;                // Ejemplo: 35
  name: string;              // Ejemplo: "clefairy"
  url: string;               // URL de la especie (si la necesitas)
  types: PokemonType[];      // Arreglo de tipos, cada uno con su objeto "type"
  abilities: PokemonAbility[]; // Arreglo de habilidades
  height: number;            // Ejemplo: 6
  weight: number;            // Ejemplo: 75
  // weaknesses?: string[];  // Opcional: Podrías calcularlo a partir de los tipos
}


export interface PokeAPIResponse {
  results: { name: string; url: string }[];
}
