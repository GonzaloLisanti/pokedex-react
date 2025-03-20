import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center my-5">
      <h1
        className="display-2"
        style={{ animation: "fadeIn 2s ease-in", color: "#fff" }}
      >
        Bienvenido a la Pokédex
      </h1>
      <p
        className="lead"
        style={{ animation: "fadeIn 3s ease-in", color: "#fff" }}
      >
        Explora todos los Pokémon con la PokeAPI
      </p>
      <button
        className="btn btn-danger btn-lg mt-2"
        style={{ animation: "bounce 2s", fontFamily: "'Helvetica', sans-serif" }}
        onClick={() => navigate("/pokédex")}
      >
        Ir a la Pokédex
      </button>
    </div>
  );
};

export default Header;
