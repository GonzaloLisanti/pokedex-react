// hooks/usePokemonData.ts
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pokemon,
  PokeAPIListResponse,
  ExtendedPokemon,
  APIResource,
  TypeData,
} from "../interfaces/Pokemon";

const CACHE_VERSION = "1.5";
const BASE_URL = "https://pokeapi.co/api/v2";
const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
  timeout: 10000,
});

// Caches globales
const typeDataCache = new Map<string, TypeData>();
const requestQueue = new Map<string, Promise<TypeData | null>>();

const getTypeData = async (typeUrl: string): Promise<TypeData | null> => {
  const cacheKey = `${CACHE_VERSION}_${typeUrl}`;

  if (typeDataCache.has(cacheKey)) return typeDataCache.get(cacheKey)!;
  if (requestQueue.has(cacheKey)) return requestQueue.get(cacheKey)!;

  const request = api
    .get<TypeData>(typeUrl)
    .then(({ data }) => {
      const spanishName =
        data.names.find((n) => n.language.name === "es")?.name || data.name;
      const processedData: TypeData = {
        ...data,
        name:
          spanishName.charAt(0).toUpperCase() +
          spanishName.slice(1).toLowerCase(),
      };
      typeDataCache.set(cacheKey, processedData);
      return processedData;
    })
    .catch((err) => {
      console.error(`Error fetching type: ${typeUrl}`, err);
      return null;
    })
    .finally(() => {
      requestQueue.delete(cacheKey);
    });

  requestQueue.set(cacheKey, request);
  return request;
};

const getPokemonWeaknesses = async (pokemon: Pokemon): Promise<string[]> => {
  const weaknesses = new Set<string>();

  await Promise.all(
    pokemon.types.map(async (t) => {
      const typeData = await getTypeData(t.type.url);
      if (!typeData) return;

      typeData.damage_relations.double_damage_from.forEach((weak) => {
        const typeName =
          typeDataCache.get(`${CACHE_VERSION}_${weak.url}`)?.name || "unknown";
        weaknesses.add(typeName.toLowerCase());
      });
    })
  );

  return Array.from(weaknesses);
};

const fetchDetailsBatch = async (
  pokemonSubset: APIResource[],
  detailsMap: Map<number, ExtendedPokemon>
): Promise<Map<number, ExtendedPokemon>> => {
  const BATCH_SIZE = 10;

  for (let i = 0; i < pokemonSubset.length; i += BATCH_SIZE) {
    const batch = pokemonSubset.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (p) => {
        const id = parseInt(p.url.split("/")[6], 10);
        if (detailsMap.has(id)) return;

        try {
          const { data } = await api.get<Pokemon>(p.url);

          // Precargar tipos primero
          await Promise.all(data.types.map((t) => getTypeData(t.type.url)));

          const [weaknesses, translatedTypes] = await Promise.all([
            getPokemonWeaknesses(data),
            Promise.all(
              data.types.map(async (t) => ({
                slot: t.slot,
                type: {
                  ...t.type,
                  name: (await getTypeData(t.type.url))?.name || "unknown",
                },
              }))
            ),
          ]);

          detailsMap.set(id, {
            ...data,
            types: translatedTypes,
            weaknesses,
          });
        } catch (err) {
          console.error("Error fetching Pokémon", p.name, err);
        }
      })
    );
  }
  return detailsMap;
};

const usePokemonData = () => {
  const [fullList, setFullList] = useState<APIResource[]>([]);
  const [basicList, setBasicList] = useState<APIResource[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<
    Map<number, ExtendedPokemon>
  >(new Map());
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(
    `${BASE_URL}/pokemon?limit=20&offset=0`
  );

  // En el useEffect inicial:
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingList(true);
      try {
        const [fullListRes, initialBatchRes] = await Promise.all([
          api.get<PokeAPIListResponse>("/pokemon?limit=1025"),
          api.get<PokeAPIListResponse>("/pokemon?limit=20&offset=0"),
        ]);

        setFullList(fullListRes.data.results);
        setBasicList(initialBatchRes.data.results);
        setNextUrl(initialBatchRes.data.next);

        // Precargar tipos del batch inicial
        const initialPokemons = await Promise.all(
          initialBatchRes.data.results.map((p) =>
            api.get<Pokemon>(p.url).then((res) => res.data)
          )
        );

        await Promise.all(
          initialPokemons.flatMap((p) =>
            p.types.map((t) => getTypeData(t.type.url))
          )
        );
      } catch (err) {
        setError("Error inicial: " + (err as Error).message);
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchPokemonBatch = async () => {
    if (!nextUrl || isLoadingList) return;
    setIsLoadingList(true);

    try {
      const { data } = await api.get<PokeAPIListResponse>(nextUrl);
      setBasicList((prev) => [...prev, ...data.results]);
      setNextUrl(data.next);

      // Precargar detalles en segundo plano
      fetchDetailsBatch(data.results, new Map(pokemonDetails)).then(
        (newDetails) => {
          setPokemonDetails((prev) => new Map([...prev, ...newDetails]));
        }
      );
    } catch (err) {
      setError("Error al cargar Pokémon: " + err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const fetchDetailsForPage = async (pokemonSubset: APIResource[]) => {
    const newDetails = new Map(pokemonDetails);
    const updatedDetails = await fetchDetailsBatch(pokemonSubset, newDetails);
    setPokemonDetails(updatedDetails);
  };

  return {
    fullList,
    basicList,
    pokemonDetails,
    isLoadingList,
    error,
    fetchDetailsForPage,
    fetchPokemonBatch,
  };
};

export default usePokemonData;
