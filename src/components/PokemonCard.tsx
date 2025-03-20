import React from "react";
import { PokemonType } from "../interfaces/Pokemon";

interface PokemonCardProps {
  name: string;
  image: string;
  id: number;
  types: PokemonType[];
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  name,
  image,
  id,
  types,
}) => {
  return (
    <div className="card text-center m-2 p-2" style={{ width: "13rem" }}>
      <img
        src={image}
        className="card-img-top rounded"
        alt={name}
        style={{ backgroundColor: "rgb(240, 240, 240)" }}
      />
      <div className="d-flex justify-content-start ms-2">
        <span className="text-muted">#{id.toString().padStart(4, "0")}</span>
      </div>
      <div className="card-body pt-0">
        <h5 className="card-title text-capitalize d-flex justify-content-start">{name}</h5>
        <div className="d-flex justify-content-center gap-2">
          {types.map((type) => (
            <span
              key={type.slot}
              className="badge rounded-pill"
              style={{ backgroundColor: "#67d964" }}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
