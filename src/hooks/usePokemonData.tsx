// hooks/usePokemonData.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon, PokemonAbility, PokemonType } from "../interfaces/Pokemon";

const usePokemonData = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true); // Para manejar la carga de detalles

  useEffect(() => {
    const fetchAllPokemons = async () => {
      try {
        // Paso 1: Obtener la lista básica de Pokémon
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const basicList = response.data.results;

        // Paso 2: Almacenar la lista básica
        setPokemonList(basicList);
        setFilteredPokemon(basicList);

        // Paso 3: Cargar los detalles de todos los Pokémon en lotes
        const batchSize = 20; // Número de Pokémon por lote
        const allPokemonDetails: Pokemon[] = [];

        for (let i = 0; i < basicList.length; i += batchSize) {
          const batch = basicList.slice(i, i + batchSize);
          const batchDetails = await Promise.all(
            batch.map(async (pokemon: { name: string; url: string }) => {
              const id = parseInt(pokemon.url.split("/")[6], 10);
              const detailsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
              return {
                name: detailsResponse.data.name,
                url: pokemon.url,
                id: detailsResponse.data.id,
                types: detailsResponse.data.types.map((t: PokemonType) => ({
                  slot: t.slot,
                  type: { name: t.type.name, url: t.type.url },
                })),
                abilities: detailsResponse.data.abilities.map((a: PokemonAbility) => ({
                  ability: { name: a.ability.name, url: a.ability.url },
                  is_hidden: a.is_hidden,
                  slot: a.slot,
                })),
                height: detailsResponse.data.height,
                weight: detailsResponse.data.weight,
              };
            })
          );

          allPokemonDetails.push(...batchDetails);

          // Si es el primer lote, mostrar los primeros 20 Pokémon rápidamente
          if (i === 0) {
            setPokemonList(allPokemonDetails);
            setFilteredPokemon(allPokemonDetails);
            setIsLoading(false); // Ocultar el spinner inicial
          }
        }

        // Paso 4: Almacenar todos los detalles
        setPokemonList(allPokemonDetails);
        setFilteredPokemon(allPokemonDetails);
        setIsLoadingDetails(false); // Finalizar la carga de detalles
      } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
        setIsLoading(false);
        setIsLoadingDetails(false);
      }
    };

    fetchAllPokemons();
  }, []);

  return {
    pokemonList,
    filteredPokemon,
    isLoading,
    isLoadingDetails,
    setFilteredPokemon,
  };
};

export default usePokemonData;