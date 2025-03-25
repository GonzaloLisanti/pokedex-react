import React, { useEffect, useMemo, useState } from "react";
import usePokemonData from "../hooks/usePokemonData";
import PokemonList from "../components/PokemonList";
import SearchSection from "../components/SearchSection";
import AdvancedFilters from "../components/AdvancedFilters";
import { Pokemon, ExtendedPokemon } from "../interfaces/Pokemon";
import { ALL_TYPES } from "../utils/Types";
import NoResultsMessage from "../components/NoResultsMessage";

const PokeDex: React.FC = () => {
  // Estados para búsqueda simple y filtros
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  // Estados para AdvancedFilters: "selected" (en tiempo real) y "applied" (cuando se pulsa "Aplicar Filtros")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedWeaknesses, setAppliedWeaknesses] = useState<string[]>([]);

  const limit = 20;

  // Obtenemos datos del hook
  const {
    fullList, // Lista completa (por ejemplo, 1025 Pokémon básicos) para filtrar globalmente
    pokemonDetails, // Detalles completos de los Pokémon que se han cargado
    isLoadingList,
    error,
    fetchDetailsForPage,
    fetchPokemonBatch,
  } = usePokemonData();

  // Al iniciar, se carga el primer batch
  useEffect(() => {
    fetchPokemonBatch();
  }, []);

  // Función de búsqueda simple
  const handleSearch = () => {
    setQuery(search.trim());
  };

  // Alternar visibilidad de filtros avanzados
  const toggleCollapse = () => setIsCollapseOpen((prev) => !prev);

  // Aplicar filtros avanzados: se actualizan los estados "applied" y se reinicia el display
  const handleApplyFilters = () => {
    setAppliedTypes(selectedTypes);
    setAppliedWeaknesses(selectedWeaknesses);
    // Reiniciamos el contador de elementos a mostrar
    setDisplayCount(limit);
  };

  // Filtrar la lista básica (para búsqueda simple) usando fullList para abarcar TODOS los Pokémon
  const filteredList = useMemo(() => {
    if (!query) return fullList;
    return fullList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
        pokemon.url.split("/")[6] === query
    );
  }, [fullList, query]);

  // Cada vez que filteredList cambie, cargamos detalles para TODOS esos Pokémon
  useEffect(() => {
    if (filteredList.length > 0) {
      fetchDetailsForPage(filteredList);
    }
  }, [filteredList]);

  // Construir la lista completa de Pokémon con detalles
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

  // Aplicar filtros avanzados sobre toda la lista
  const filteredPokemonGlobal = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      const typeMatch =
        appliedTypes.length === 0 ||
        pokemon.types.some((t) =>
          appliedTypes.includes(t.type.name.toLowerCase())
        );
      const weaknessMatch =
        appliedWeaknesses.length === 0 ||
        ((pokemon as ExtendedPokemon).weaknesses || []).some((w) =>
          appliedWeaknesses.includes(w.toLowerCase())
        );
      return typeMatch && weaknessMatch;
    });
  }, [allPokemon, appliedTypes, appliedWeaknesses]);

  // Estado para controlar cuántos Pokémon filtrados se muestran
  const [displayCount, setDisplayCount] = useState(limit);

  // Lista final de Pokémon a mostrar (paginar el resultado filtrado globalmente)
  const finalPokemonToShow = useMemo(() => {
    return filteredPokemonGlobal.slice(0, displayCount);
  }, [filteredPokemonGlobal, displayCount]);

  // Función para cargar más resultados
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + limit);
    // Opcional: Si es necesario, carga más Pokémon a la lista básica
    fetchPokemonBatch();
  };
  //Función para limpiar filtros
  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedWeaknesses([]);
    setAppliedTypes([]);
    setAppliedWeaknesses([]);
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
        <button
          className="btn w-100 lead text-white"
          aria-expanded={isCollapseOpen}
          onClick={toggleCollapse}
          style={{
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          Búsqueda avanzada
          <i
            className={`fs-4 ms-2 bi ${
              isCollapseOpen ? "bi-arrows-collapse" : "bi-arrows-expand"
            } fs-5`}
          ></i>
        </button>
        {isCollapseOpen && (
          <AdvancedFilters
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedWeaknesses={selectedWeaknesses}
            setSelectedWeaknesses={setSelectedWeaknesses}
            allTranslatedTypes={ALL_TYPES}
            onApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
          />
        )}
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
