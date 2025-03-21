import { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokemonType, TypeTranslation } from "../interfaces/Pokemon";

// Cache para almacenar traducciones de tipos
const typeCache = new Map<string, string>();

const usePokemonData = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener traducciones de tipos con cache
  const getCachedTypeTranslation = async (
    typeName: string,
    typeUrl: string
  ): Promise<string> => {
    if (typeCache.has(typeName)) return typeCache.get(typeName)!;

    try {
      const response = await axios.get<TypeTranslation>(typeUrl);
      const spanishName =
        response.data.names.find((n) => n.language.name === "es")?.name ||
        typeName;
      typeCache.set(typeName, spanishName);
      return spanishName;
    } catch (error) {
      console.error(`Error fetching type for ${typeName}:`, error);
      return typeName;
    }
  };

  useEffect(() => {
    const fetchAllPokemons = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1025"
        );
        const basicList = response.data.results;

        const batchSize = 20;
        const allPokemonDetails: Pokemon[] = [];
        let initialBatchLoaded = false;

        for (let i = 0; i < basicList.length; i += batchSize) {
          const batch = basicList.slice(i, i + batchSize);
          const batchDetails = await Promise.allSettled(
            batch.map(async (pokemon: { name: string; url: string }) => {
              try {
                const id = parseInt(pokemon.url.split("/")[6], 10);
                const detailsResponse = await axios.get(
                  `https://pokeapi.co/api/v2/pokemon/${id}`
                );

                // Procesar tipos con cache
                const types = await Promise.all(
                  detailsResponse.data.types.map(async (t: PokemonType) => {
                    const typeName = t.type.name;
                    const translatedName = await getCachedTypeTranslation(
                      typeName,
                      t.type.url
                    );
                    return {
                      slot: t.slot,
                      type: {
                        name: translatedName,
                        url: t.type.url,
                      },
                    };
                  })
                );

                return {
                  name: detailsResponse.data.name,
                  url: pokemon.url,
                  id: detailsResponse.data.id,
                  types,
                  abilities: detailsResponse.data.abilities, // Mantenemos inglés temporalmente
                  height: detailsResponse.data.height,
                  weight: detailsResponse.data.weight,
                };
              } catch (error) {
                console.error("Error processing Pokémon details:", error);
                return null;
              }
            })
          );

          const validDetails = batchDetails
            .filter(
              (result) => result.status === "fulfilled" && result.value !== null
            )
            .map((result) => (result as PromiseFulfilledResult<Pokemon>).value);
          allPokemonDetails.push(...validDetails);

          if (!initialBatchLoaded) {
            setPokemonList(validDetails);
            setFilteredPokemon(validDetails);
            setIsLoading(false);
            initialBatchLoaded = true;
          }
        }

        setPokemonList(allPokemonDetails);
        setFilteredPokemon(allPokemonDetails);
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        setIsLoading(false);
      }
    };

    fetchAllPokemons();
  }, []);

  return {
    pokemonList,
    filteredPokemon,
    isLoading,
    setFilteredPokemon,
  };
};

export default usePokemonData;
