import React, { useState } from "react";

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

// Mapeo de colores por tipo
const typeColors: { [key: string]: string } = {
  Bicho: "#a5ff4c",
  Dragón: "#3c6eff",
  Hada: "#fbadff",
  Fuego: "#ff9952",
  Fantasma: "#5a68eb",
  Tierra: "#df9234",
  Normal: "#cccccc",
  Psíquico: "#ff97b0",
  Acero: "#7cb1f1",
  Siniestro: "#5b5769",
  Eléctrico: "#fffe4a",
  Lucha: "#ff4848",
  Volador: "#abc4e2",
  Planta: "#63cc3b",
  Hielo: "#a1eff4",
  Veneno: "#ce7aff",
  Roca: "#dbc097",
  Agua: "#6ca6ff",
};

// Función para determinar el color del texto basado en el brillo del fondo
const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

const PokemonCard: React.FC<PokemonCardProps> = ({
  name,
  image,
  id,
  types,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Preparar el borde según los types
  const borderColors = types.map((t) => typeColors[t.type.name] || "#67d964");
  const gradient =
    types.length > 1
      ? `linear-gradient(90deg, ${borderColors[0]} 0%, ${borderColors[1]} 100%)`
      : borderColors[0];

  return (
    <div style={{ position: "relative", width: "13rem", margin: "0.5rem" }}>
      {/* Placeholder con animación pokeLoader mientras no se carga la imagen */}
      {!isLoaded && (
        <div style={{ width: "13rem" }}>
          <div className="pokeLoader" ></div>
        </div>
      )}
      {/* La card se muestra cuando la imagen ya se cargó */}
      <div
        className={`card text-center m-2 p-2 ${
          isLoaded ? "fade-in" : "d-none"
        }`}
        style={{
          width: "13rem",
          background: "#ffffff",
          border: "none",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            background: gradient,
            borderRadius: "0.375rem",
            zIndex: -1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: "2px",
              right: "2px",
              bottom: "2px",
              background: "#ffffff",
              borderRadius: "0.25rem",
            }}
          />
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
              const bgColor = typeColors[type.type.name] || "#67d964";
              const textColor = getContrastColor(bgColor);
              return (
                <span
                  key={type.type.url}
                  className="badge rounded-pill px-3"
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
