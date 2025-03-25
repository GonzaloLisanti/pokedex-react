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

export interface ExtendedPokemon extends Pokemon {
  weaknesses: string[];
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

export interface DamageRelations {
  double_damage_from: APIResource[];
  double_damage_to: APIResource[];
  half_damage_from: APIResource[];
  half_damage_to: APIResource[];
  no_damage_from: APIResource[];
  no_damage_to: APIResource[];
}

export interface TypeData {
  damage_relations: DamageRelations;
  game_indices: unknown[]; // no lo usaremos, pero lo definimos como unknown o lo podemos omitir
  generation: APIResource;
  id: number;
  moves: string[]; // o APIResource[] según la respuesta, pero si no lo usas puedes omitirlo
  name: string;
  names: Array<{
    language: APIResource;
    name: string;
  }>;
}
