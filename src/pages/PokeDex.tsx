import React, { useEffect, useMemo, useState } from "react";
import usePokemonData from "../hooks/usePokemonData";
import PokemonList from "../components/PokemonList";
import SearchSection from "../components/SearchSection";
import AdvancedFilters from "../components/AdvancedFilters";
import { Pokemon, ExtendedPokemon } from "../interfaces/Pokemon";
import { ALL_TYPES } from "../utils/Types";
import NoResultsMessage from "../components/NoResultsMessage";
import { useFilters } from "../context/FiltersContext";

const PokeDex: React.FC = () => {
  // Estados para búsqueda simple
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  // Estados locales "applied" (se actualizan al presionar "Buscar")
  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedWeaknesses, setAppliedWeaknesses] = useState<string[]>([]);
  const [appliedAbility, setAppliedAbility] = useState<string>("");
  const [appliedHeights, setAppliedHeights] = useState<string[]>([]);
  const [appliedWeights, setAppliedWeights] = useState<string[]>([]);

  const limit = 20;

  // Hook con datos de Pokémon
  const {
    fullList, // Lista básica de Pokémon
    pokemonDetails, // Detalles completos (tipos, habilidades, etc.)
    isLoadingList,
    error,
    fetchDetailsForPage,
    fetchPokemonBatch,
  } = usePokemonData();

  const {
    selectedTypes,
    setSelectedTypes,
    selectedWeaknesses,
    setSelectedWeaknesses,
    selectedAbility,
    setSelectedAbility,
    selectedHeights,
    setSelectedHeights,
    selectedWeights,
    setSelectedWeights,
  } = useFilters();

  // Al montar, cargar primer batch
  useEffect(() => {
    fetchPokemonBatch();
  }, []);

  // Búsqueda simple
  const handleSearch = () => {
    setQuery(search.trim());
  };

  // Mostrar/ocultar panel de filtros avanzados
  const toggleCollapse = () => setIsCollapseOpen((prev) => !prev);

  const handleApplyFilters = () => {
    setAppliedTypes(selectedTypes);
    setAppliedWeaknesses(selectedWeaknesses);
    setAppliedAbility(selectedAbility);
    setAppliedHeights(selectedHeights);
    setAppliedWeights(selectedWeights);
    setDisplayCount(limit);
  };

  useEffect(() => {
    // Solo al cargar el componente, asegurarse de que los filtros aplicados sean los guardados en el contexto
    setAppliedTypes(selectedTypes);
    setAppliedWeaknesses(selectedWeaknesses);
    setAppliedAbility(selectedAbility);
    setAppliedHeights(selectedHeights);
    setAppliedWeights(selectedWeights);
  }, []);
  
  // Filtrar la lista básica para la búsqueda simple
  const filteredList = useMemo(() => {
    if (!query) return fullList;
    return fullList.filter((pokemon) => {
      const id = pokemon.url.split("/")[6];
      return (
        pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
        id === query.toString()
      );
    });
  }, [fullList, query]);

  // Cargar detalles de la lista filtrada
  useEffect(() => {
    if (filteredList.length > 0) {
      fetchDetailsForPage(filteredList);
    }
  }, [filteredList]);

  // Construir objetos de Pokémon completos
  const allPokemon = useMemo(() => {
    return filteredList.map((p) => {
      const id = parseInt(p.url.split("/")[6], 10);
      return (pokemonDetails.get(id) || {
        id,
        name: p.name,
        species: p,
        types: [],
        abilities: [],
        height: 0,
        weight: 0,
        sprites: { other: { "official-artwork": { front_default: "" } } },
      }) as Pokemon;
    });
  }, [filteredList, pokemonDetails]);

  // Función para clasificar un Pokémon según su altura
  const getHeightCategory = (pokemon: Pokemon): string => {
    const meters = pokemon.height / 10; // height viene en decímetros
    if (meters < 1) return "small";
    if (meters <= 2) return "medium";
    return "large";
  };

  // Función para clasificar el peso de un Pokémon (suponiendo que weight viene en hectogramos)
  const getWeightCategory = (pokemon: Pokemon): string => {
    // Ejemplo arbitrario:
    // Liviano: menos de 50 hectogramos
    // Medio: entre 50 y 200 hectogramos
    // Pesado: más de 200 hectogramos
    if (pokemon.weight < 50) return "light";
    if (pokemon.weight <= 200) return "medium";
    return "heavy";
  };

  // Filtrado avanzado global
  const filteredPokemonGlobal = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      // Filtro por tipo
      const typeMatch =
        appliedTypes.length === 0 ||
        pokemon.types.some((t) =>
          appliedTypes.includes(t.type.name.toLowerCase())
        );

      // Filtro por debilidad
      const weaknessMatch =
        appliedWeaknesses.length === 0 ||
        ((pokemon as ExtendedPokemon).weaknesses || []).some((w) =>
          appliedWeaknesses.includes(w.toLowerCase())
        );

      // Filtro por habilidad
      const abilityMatch =
        appliedAbility === "" ||
        pokemon.abilities.some((a) => {
          // Extraer ID de la habilidad
          const segments = a.ability.url.split("/").filter(Boolean);
          const abilityId = segments[segments.length - 1];
          return abilityId === appliedAbility;
        });

      // Filtro por altura
      const pokemonHeightCategory = getHeightCategory(pokemon);
      const heightMatch =
        appliedHeights.length === 0 ||
        appliedHeights.includes(pokemonHeightCategory);

      const pokemonWeightCategory = getWeightCategory(pokemon);
      const weightMatch =
        appliedWeights.length === 0 ||
        appliedWeights.includes(pokemonWeightCategory);
      return (
        typeMatch && weaknessMatch && abilityMatch && heightMatch && weightMatch
      );
    });
  }, [
    allPokemon,
    appliedTypes,
    appliedWeaknesses,
    appliedAbility,
    appliedHeights,
    appliedWeights,
  ]);

  // Paginación: cuántos Pokémon mostrar
  const [displayCount, setDisplayCount] = useState(limit);

  // Lista final de Pokémon a mostrar (después de todos los filtros)
  const finalPokemonToShow = useMemo(() => {
    return filteredPokemonGlobal.slice(0, displayCount);
  }, [filteredPokemonGlobal, displayCount]);

  // Cargar más
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + limit);
    fetchPokemonBatch();
  };

  // Resetear todo
  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedWeaknesses([]);
    setAppliedTypes([]);
    setAppliedWeaknesses([]);
    setSelectedAbility("");
    setAppliedAbility("");
    setSelectedHeights([]);
    setAppliedHeights([]);
    setSelectedWeights([]);
    setAppliedWeights([]);
    setQuery("");
    setDisplayCount(limit);
  };

  return (
    <div className="container text-center p-0" style={{ marginTop: "100px" }}>
      {/* Título */}
      <div className="d-flex justify-content-center mb-0">
        <h1
          className="display-4 pokedex-title rounded-top px-5 bg-gradient"
          style={{ backgroundColor: "#4e4e4e" }}
        >
          Pokédex
        </h1>
      </div>

      {/* Barra de búsqueda */}
      <SearchSection
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        pokemonList={fullList}
      />

      {/* Filtros avanzados */}
      <div
        className="d-flex flex-column align-items-center mb-3 rounded-bottom"
        style={{ backgroundColor: "#494a51" }}
      >
        {isCollapseOpen && (
          <AdvancedFilters
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedWeaknesses={selectedWeaknesses}
            setSelectedWeaknesses={setSelectedWeaknesses}
            allTranslatedTypes={ALL_TYPES}
            selectedAbility={selectedAbility}
            setSelectedAbility={setSelectedAbility}
            selectedHeights={selectedHeights}
            setSelectedHeights={setSelectedHeights}
            selectedWeights={selectedWeights}
            setSelectedWeights={setSelectedWeights}
            onApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
          />
        )}
        <button
          className="btn w-100 lead text-white"
          aria-expanded={isCollapseOpen}
          onClick={toggleCollapse}
          style={{
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          {!isCollapseOpen
            ? "Mostrar Búsqueda Avanzada"
            : "Ocultar Búsqueda Avanzada"}
          <i
            className={`fs-4 ms-2 bi ${
              isCollapseOpen ? "bi-arrows-collapse" : "bi-arrows-expand"
            } fs-5`}
          ></i>
        </button>
      </div>

      {/* Lista de Pokémon y botón "Cargar más" */}
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {!isLoadingList && filteredPokemonGlobal.length === 0 ? (
            <NoResultsMessage />
          ) : (
            <PokemonList
              pokemonToShow={finalPokemonToShow}
              fetchPokemonBatch={fetchPokemonBatch}
              isLoadingList={isLoadingList}
              displayCount={displayCount}
              filteredPokemonGlobal={filteredPokemonGlobal}
              handleLoadMore={handleLoadMore}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PokeDex;
