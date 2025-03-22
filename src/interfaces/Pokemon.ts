export interface APIResource {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: APIResource;
}

export interface PokemonAbility {
  ability: APIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  other: {
    "official-artwork": {
      front_default: string;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  species: APIResource;
  types: PokemonType[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  sprites: PokemonSprites;
}

export interface PokeAPIListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: APIResource[];
}

export interface TypeTranslation {
  names: Array<{
    language: APIResource;
    name: string;
  }>;
}