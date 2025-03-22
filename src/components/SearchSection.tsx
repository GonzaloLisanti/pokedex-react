// components/SearchSection.tsx
import React from "react";
import SearchBar from "./SearchBar";
import { APIResource } from "../interfaces/Pokemon";

interface SearchSectionProps {
  search: string;
  setSearch: (search: string) => void;
  handleSearch: () => void;
  pokemonList: APIResource[];
}

const SearchSection: React.FC<SearchSectionProps> = ({
  search,
  setSearch,
  handleSearch,
  pokemonList,
}) => {
  return (
    <div className="rounded shadow" style={{
      backgroundImage: "linear-gradient(to top,rgb(134, 134, 134), #4e4e4e)",
      color: "white",
    }}>
      <div className="d-flex justify-content-center ms-5 lead pt-3 text-white w-50">
        <strong>Nombre o Número</strong>
      </div>
      <div className="d-flex flex-wrap align-items-center justify-content-between w-75 mb-4 mx-auto">
        <div className="flex-grow-1 me-3 mb-4" style={{ maxWidth: "400px" }}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            pokemonList={pokemonList}
          />
        </div>
        <div
          className="text-start bg-gradient text-white p-3 rounded mb-4"
          style={{
            minWidth: "250px",
            width: "400px",
            backgroundColor: "#67d964",
          }}
        >
          <p className="mb-0">
            Busca un Pokémon por su nombre o usando su número de la Pokédex
            Nacional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;