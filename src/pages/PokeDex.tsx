// PokeDex.tsx
import React, { useEffect, useMemo, useState } from "react";
import usePokemonData from "../hooks/usePokemonData";
import PokemonList from "../components/PokemonList";
import SearchSection from "../components/SearchSection";
import { Pokemon } from "../interfaces/Pokemon";

const PokeDex: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 20;
  const [query, setQuery] = useState("");

  const {
    basicList,
    pokemonDetails,
    isLoadingList,
    error,
    fetchDetailsForPage,
  } = usePokemonData();

  // Función que se dispara al buscar
  const handleSearch = () => {
    setQuery(search);
    setCurrentPage(1);
  };

  // Filtrar la lista básica usando `query` en lugar de `search`
  const filteredList = useMemo(() => {
    if (!query.trim()) return basicList;
    return basicList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
        pokemon.url.split("/")[6] === query
    );
  }, [basicList, query]);

  // Calcular la página actual de la lista filtrada
  const startIndex = (currentPage - 1) * limit;
  const currentPagePokemons = useMemo(() => {
    return filteredList.slice(startIndex, startIndex + limit);
  }, [filteredList, startIndex, limit]);

  // Solicitar detalles de la página actual si aún no se han cargado
  useEffect(() => {
    fetchDetailsForPage(currentPagePokemons);
  }, [currentPagePokemons]);

  // Combinar datos básicos con detalles disponibles
  const pokemonToShow = currentPagePokemons.map((p) => {
    const id = parseInt(p.url.split("/")[6], 10);
    const detail = pokemonDetails.get(id);
    if (detail) {
      return detail;
    }
    // Objeto esqueleto
    return {
      id,
      name: p.name,
      species: p,
      types: [],
      abilities: [],
      height: 0,
      weight: 0,
      sprites: {
        other: {
          "official-artwork": {
            front_default: "", // o una imagen placeholder
          },
        },
      },
    } as Pokemon;
  });

  const totalPages = Math.ceil(filteredList.length / limit);

  return (
    <div className="container text-center p-0" style={{ marginTop: "100px" }}>
      <div className="d-flex justify-content-center mb-0">
        <h1
          className="display-4 pokedex-title rounded-top px-5 bg-gradient"
          style={{ backgroundColor: "#4e4e4e" }}
        >
          Pokédex
        </h1>
      </div>

      <SearchSection
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        pokemonList={basicList}
      />

      {isLoadingList ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <PokemonList
          pokemonToShow={pokemonToShow}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default PokeDex;
