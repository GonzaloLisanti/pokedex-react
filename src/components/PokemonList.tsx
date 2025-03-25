// components/PokemonList.tsx
import React from "react";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "../interfaces/Pokemon";

interface PokemonListProps {
  pokemonToShow: Pokemon[];
  filteredPokemonGlobal: Pokemon[];
  fetchPokemonBatch: () => void;
  isLoadingList: boolean;
  displayCount: number;
  handleLoadMore: () => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  pokemonToShow,
  isLoadingList,
  displayCount,
  filteredPokemonGlobal,
  handleLoadMore,
}) => {
  const uniquePokemon = Array.from(
    new Map(pokemonToShow.map((p) => [p.id, p])).values()
  );

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center gap-1">
        {uniquePokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            id={pokemon.id}
            types={pokemon.types}
          />
        ))}
      </div>
      <div className="d-flex justify-content-center mt-2 ">
        {displayCount < filteredPokemonGlobal.length && (
          <button
            className="btn mb-4 lead rounded w-md-25"
            onClick={(e) => {
              e.preventDefault();
              handleLoadMore();
            }}
            disabled={isLoadingList}
            style={{
              border: "2px solid #4f68f3",
              backgroundColor: "#f6ff2e",
              boxShadow: "0px 2px 25px rgba(0, 0, 0, 250)",
              transition: "all 0.3s ease", // Agregado para mejor experiencia
            }}
          >
            {isLoadingList ? (
              <span className="lead">Cargando...</span>
            ) : (
              <span className="lead">Cargar más Pokémon</span>
            )}
            <i className="fs-4 ms-2 bi bi-plus-circle-dotted"></i>
          </button>
        )}
      </div>
    </>
  );
};

export default PokemonList;
