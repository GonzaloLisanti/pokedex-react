import React, { useState } from "react";
import { Pokemon } from "../interfaces/Pokemon";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  handleSearch: () => void;
  pokemonList: Pokemon[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  handleSearch,
  pokemonList,
}) => {
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Estado para controlar la visibilidad

  const normalizeName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      const filtered = pokemonList.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(value.toLowerCase()) ||
          pokemon.url.split("/")[6].includes(value) // Busca por número de Pokédex
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="input-group" style={{ width: "100%", maxWidth: "500px", position: "relative" }}>
      <input
        style={{ fontFamily: "'Helvetica', sans-serif" }}
        type="text"
        className="form-control"
        value={search}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)} // Mostrar sugerencias al hacer clic
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Ocultar después de un breve delay
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        className="btn text-white bg-gradient"
        onClick={handleSearch}
        style={{ fontFamily: "'Helvetica', sans-serif", backgroundColor: "rgba(255, 59, 48, 0.9)" }}
      >
        <i className="bi bi-search"></i>
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="suggestions-container"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          {suggestions.map((pokemon, index) => (
            <div
              key={index}
              className="suggestion-item"
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={(e) => e.preventDefault()} // Evita que el blur cierre la lista antes de seleccionar
              onClick={() => {
                setSearch(normalizeName(pokemon.name));
                setSuggestions([]);
                setShowSuggestions(false);
              }}
            >
              {normalizeName(pokemon.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
