import React, { useState } from "react";
import { getContrastColor } from "../utils/getContrastColor";
import { TYPE_COLORS } from "../utils/Types";
interface PokemonCardProps {
  name: string;
  image: string;
  id: number;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  name,
  image,
  id,
  types,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Obtener colores para el borde y la sombra según los tipos
  const borderColors = types.map((t) => TYPE_COLORS[t.type.name] || "#ececf0");

  const gradient =
    types.length > 1
      ? `linear-gradient(90deg, ${borderColors[0]} 0%, ${borderColors[1]} 100%)`
      : borderColors[0];

  return (
    <div className="pokemon-card-container">
      {!isLoaded && (
        <div className="pokemon-card-loader d-flex  justify-content-center">
          <div className="pokeLoader"></div>
        </div>
      )}
      <div
        className={`card text-center m-2 p-2 ${
          isLoaded ? "fade-in" : "d-none"
        }`}
      >
        {/* Sombra degradada detrás de la card */}
        <div className="card-shadow" style={{ background: gradient }} />

        {/* Contenedor del borde degradado */}
        <div className="card-border" style={{ background: gradient }}>
          {/* Contenido interno para que el borde se vea bien */}
          <div className="card-inner-border" />
        </div>

        <img
          src={image}
          className="card-img-top rounded"
          alt={name}
          style={{ backgroundColor: "#f0f0f0" }}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="card-body pt-0">
          <div className="d-flex justify-content-start">
            <span className="text-muted">
              #{id.toString().padStart(4, "0")}
            </span>
          </div>
          <div className="d-flex justify-content-start">
            <h5 className="card-title text-capitalize">{name}</h5>
          </div>
          <div className="d-flex justify-content-center gap-2">
            {types.map((type) => {
              const bgColor = TYPE_COLORS[type.type.name] || "#ececf0";
              const textColor = getContrastColor(bgColor);
              return (
                <span
                  key={type.type.url}
                  className="typesP badge rounded-pill px-3"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                >
                  {type.type.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
