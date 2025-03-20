// PokeDex.tsx
import React, { useState } from "react";
import usePokemonData from "../hooks/usePokemonData";
import PokemonList from "../components/PokemonList";
import SearchSection from "../components/SearchSection";

const PokeDex: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 20;

  const {
    pokemonList,
    filteredPokemon,
    isLoading,
    setFilteredPokemon,
  } = usePokemonData();

  const handleSearch = () => {
    if (search.trim()) {
      const filtered = pokemonList.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
          pokemon.id.toString() === search
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemonList);
    }
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const pokemonToShow = filteredPokemon.slice(startIndex, endIndex);

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
        pokemonList={pokemonList}
      />

      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div className="loader"></div>
        </div>
      ) : (
        <PokemonList
          pokemonToShow={pokemonToShow}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredPokemon.length / limit)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default PokeDex;