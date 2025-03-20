// components/PokemonList.tsx
import React from "react";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { Pokemon } from "../interfaces/Pokemon";

interface PokemonListProps {
  pokemonToShow: Pokemon[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  pokemonToShow,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      <div className="d-flex flex-wrap justify-content-center">
        {pokemonToShow.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            name={pokemon.name}
            image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            id={pokemon.id}
            types={pokemon.types}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default PokemonList;