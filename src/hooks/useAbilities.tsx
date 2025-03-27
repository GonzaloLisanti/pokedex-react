// hooks/useAbilities.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { APIResource, PokeAPIListResponse } from "../interfaces/Pokemon";

export interface Ability {
  id: number;
  name: string; // Aquí se almacenará el nombre en español
  generation: APIResource;
  effect_entries: Array<{
    effect: string;
    language: APIResource;
    short_effect: string;
  }>;
  names: Array<{
    language: APIResource;
    name: string;
  }>;
  // Puedes agregar otras propiedades que necesites
}

const BASE_URL = "https://pokeapi.co/api/v2";

const useAbilities = () => {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbilities = async () => {
      try {
        // 1. Obtener la lista de habilidades
        const response = await axios.get<PokeAPIListResponse>(`${BASE_URL}/ability?limit=327`);
        const abilitiesList = response.data.results;

        // 2. Obtener el detalle de cada habilidad para extraer la traducción en español
        const abilitiesWithTranslations = await Promise.all(
          abilitiesList.map(async (ability) => {
            try {
              const detailResponse = await axios.get<Ability>(ability.url);
              const abilityData = detailResponse.data;
              // Buscar el nombre en español dentro de 'names'
              const spanishName =
                abilityData.names.find((n) => n.language.name === "es")?.name ||
                abilityData.name;
              return { ...abilityData, name: spanishName };
            } catch (error) {
              console.error("Error fetching ability details", ability.url, error);
              // Si falla, retorna un objeto básico con el nombre original
              return { id: 0, name: ability.name, generation: { name: "", url: "" }, effect_entries: [], names: [] };
            }
          })
        );

        setAbilities(abilitiesWithTranslations);
      } catch (err) {
        console.error(err);
        setError("Error al obtener las habilidades");
      } finally {
        setLoading(false);
      }
    };

    fetchAbilities();
  }, []);

  return { abilities, loading, error };
};

export default useAbilities;
