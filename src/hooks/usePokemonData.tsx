// hooks/usePokemonData.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokeAPIListResponse, TypeTranslation } from "../interfaces/Pokemon";

const CACHE_VERSION = "1.0";
const BASE_URL = "https://pokeapi.co/api/v2";
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Accept": "application/json" }
});

// Cache para las traducciones de types
const typeCache = new Map<string, string>();

// Función para obtener la traducción de un type al español
const getTypeTranslation = async (typeUrl: string): Promise<string> => {
  const cacheKey = `${CACHE_VERSION}_${typeUrl}`;
  if (typeCache.has(cacheKey)) return typeCache.get(cacheKey)!;

  try {
    const { data } = await api.get<TypeTranslation>(typeUrl);
    const spanishName = data.names.find(n => n.language.name === "es")?.name;
    const fallback = typeUrl.split("/")[6];
    const finalName = spanishName || fallback;
    typeCache.set(cacheKey, finalName);
    return finalName;
  } catch (err) {
    console.error("Error fetching type:", err);
    return "unknown";
  }
};

const usePokemonData = () => {
  const [basicList, setBasicList] = useState<PokeAPIListResponse["results"]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<Map<number, Pokemon>>(new Map());
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar la lista básica de Pokémon
  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await api.get<PokeAPIListResponse>("/pokemon?limit=1025");
        setBasicList(data.results);
      } catch (err) {
        setError("Error al cargar la lista básica de Pokémon: " + err);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchList();
  }, []);

  // Cargar detalles para un conjunto de Pokémon, incluyendo la traducción de los types
  const fetchDetailsForPage = async (pokemonSubset: typeof basicList) => {
    const newDetails = new Map(pokemonDetails);
    await Promise.all(
      pokemonSubset.map(async (p) => {
        const id = parseInt(p.url.split("/")[6], 10);
        if (!newDetails.has(id)) {
          try {
            const { data } = await api.get<Pokemon>(p.url);
            // Traducir cada type al español
            const translatedTypes = await Promise.all(
              data.types.map(async (t) => ({
                slot: t.slot,
                type: {
                  ...t.type,
                  name: await getTypeTranslation(t.type.url)
                }
              }))
            );
            // Crear el objeto Pokémon con los types traducidos
            const pokemonWithTranslatedTypes = {
              ...data,
              types: translatedTypes
            };
            newDetails.set(id, pokemonWithTranslatedTypes);
          } catch (err) {
            console.error("Error fetching Pokémon", p.name, err);
          }
        }
      })
    );
    setPokemonDetails(newDetails);
  };

  return {
    basicList,
    pokemonDetails,
    isLoadingList,
    error,
    fetchDetailsForPage
  };
};

export default usePokemonData;
