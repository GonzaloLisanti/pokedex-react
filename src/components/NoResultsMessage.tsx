import React from "react";

const NoResultsMessage: React.FC = () => {
  return (
    <div
      className="text-center rounded my-4 p-4 border border-danger "
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <h3 className="mb-4 text-danger">
        Ningún Pokémon coincide con tu búsqueda.
      </h3>
      <div className="text-start text-dark">
        <p>Intenta lo siguiente para encontrar resultados:</p>
        <ul className="list-unstyled text-danger">
          <li className="mb-2">
            • Reduce el número de parámetros de búsqueda.
          </li>
          <li className="mb-2">
            • Haz búsquedas de tipos de Pokémon de uno en uno.
          </li>
          <li className="mb-2">
            • Intenta buscar con más de un tamaño y forma.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NoResultsMessage;
