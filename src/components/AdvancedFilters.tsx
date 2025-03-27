// AdvancedFilters.tsx
import React from "react";
import { TYPE_COLORS } from "../utils/Types";
import useAbilities from "../hooks/useAbilities";
import { heightOptions, weightOptions } from "../utils/FiltersOptions";

interface AdvancedFiltersProps {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedWeaknesses: string[];
  setSelectedWeaknesses: (weaknesses: string[]) => void;
  allTranslatedTypes: string[];
  // Nuevas props para la habilidad
  selectedAbility: string;
  setSelectedAbility: (ability: string) => void;
  selectedHeights: string[];
  setSelectedHeights: (heights: string[]) => void;
  selectedWeights: string[];
  setSelectedWeights: (weights: string[]) => void;
  onApplyFilters: () => void;
  handleResetFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  selectedTypes,
  setSelectedTypes,
  selectedWeaknesses,
  setSelectedWeaknesses,
  allTranslatedTypes,
  selectedAbility,
  setSelectedAbility,
  onApplyFilters,
  handleResetFilters,
  selectedHeights,
  setSelectedHeights,
  selectedWeights,
  setSelectedWeights,
}) => {
  const { abilities, loading, error } = useAbilities();

  const handleHeightToggle = (heightKey: string) => {
    if (selectedHeights.includes(heightKey)) {
      // Si ya está seleccionada, la removemos
      setSelectedHeights(selectedHeights.filter((h) => h !== heightKey));
    } else {
      // Si no está, la agregamos
      setSelectedHeights([...selectedHeights, heightKey]);
    }
  };

  const handleWeightToggle = (weightKey: string) => {
    if (selectedWeights.includes(weightKey)) {
      setSelectedWeights(selectedWeights.filter((w) => w !== weightKey));
    } else {
      setSelectedWeights([...selectedWeights, weightKey]);
    }
  };

  const handleTypeChange = (displayType: string) => {
    const lowerType = displayType.toLowerCase();
    const newSelection = selectedTypes.includes(lowerType)
      ? selectedTypes.filter((t) => t !== lowerType)
      : [...selectedTypes, lowerType];
    setSelectedTypes(newSelection);
  };

  const handleWeaknessChange = (displayWeakness: string) => {
    const lowerWeakness = displayWeakness.toLowerCase();
    const newSelection = selectedWeaknesses.includes(lowerWeakness)
      ? selectedWeaknesses.filter((w) => w !== lowerWeakness)
      : [...selectedWeaknesses, lowerWeakness];
    setSelectedWeaknesses(newSelection);
  };

  const getTypeColor = (displayType: string) => {
    const typeKey = Object.keys(TYPE_COLORS).find(
      (key) => key.toLowerCase() === displayType.toLowerCase()
    );
    return typeKey ? TYPE_COLORS[typeKey] : "#ececf0";
  };

  // Dividir tipos en grupos para diferentes vistas
  const typeGroups = [];
  for (let i = 0; i < allTranslatedTypes.length; i += 8) {
    typeGroups.push(allTranslatedTypes.slice(i, i + 8));
  }

  return (
    <>
      <div
        className="p-3 text-white"
        style={{
          backgroundColor: "#494a51",
          borderRadius: "10px",
          border: "2px solid #5a5c66",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div className="row">
          {/* Vista Desktop */}
          <div className="d-none d-md-block col-md-6 pe-md-4 border-end">
            <div className="d-flex mb-3 gap-5 justify-content-center">
              <h5>Tipo y Debilidad</h5>
              <h5>T= Tipo | D= Debilidad</h5>
            </div>

            <div className="row">
              {allTranslatedTypes.map((type) => (
                <div key={type} className="col-6 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn flex-grow-1 p-2 rounded text-center"
                      style={{
                        backgroundColor: getTypeColor(type),
                        color: getContrastColor(getTypeColor(type)),
                        minWidth: "120px",
                      }}
                    >
                      {type}
                    </button>
                    <div className="d-flex gap-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input rounded-circle border-top border-bottom border-primary-subtle"
                          checked={selectedTypes.includes(type.toLowerCase())}
                          onChange={() => handleTypeChange(type)}
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                            backgroundColor: "transparent",
                            border: "2px solid #2d4cff",
                          }}
                        />
                        <label className="form-check-label small fw-bold">
                          T
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input rounded-circle border-top border-bottom border-danger-subtle"
                          checked={selectedWeaknesses.includes(
                            type.toLowerCase()
                          )}
                          onChange={() => handleWeaknessChange(type)}
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                            backgroundColor: "transparent",
                            border: "2px solid #ff4848",
                          }}
                        />
                        <label className="form-check-label small fw-bold">
                          D
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vista Mobile */}
          <div className="d-md-none col-12">
            <div className="text-center mb-3">
              <h5>Tipo y Debilidad</h5>
              <small>T = Tipo | D = Debilidad</small>
            </div>

            <div className="row row-cols-2 g-2">
              {allTranslatedTypes.map((type) => (
                <div key={type} className="col">
                  <div className="d-flex align-items-center gap-1">
                    <button
                      className="btn flex-grow-1 p-1 rounded text-center"
                      style={{
                        backgroundColor: getTypeColor(type),
                        color: getContrastColor(getTypeColor(type)),
                        fontSize: "1rem",
                      }}
                    >
                      {type}
                    </button>
                    <div className="d-flex gap-1">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input rounded-circle border-top border-bottom border-primary-subtle"
                          checked={selectedTypes.includes(type.toLowerCase())}
                          onChange={() => handleTypeChange(type)}
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                            backgroundColor: "transparent",
                            border: "2px solid #2d4cff",
                          }}
                        />
                        <label className="form-check-label">T</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input rounded-circle border-top border-bottom border-danger-subtle"
                          checked={selectedWeaknesses.includes(
                            type.toLowerCase()
                          )}
                          onChange={() => handleWeaknessChange(type)}
                          style={{
                            width: "1.2em",
                            height: "1.2em",
                            backgroundColor: "transparent",
                            border: "2px solid #ff4848",
                          }}
                        />
                        <label className="form-check-label">D</label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha - Otros Filtros */}
          <div className="col-12 col-md-6 ps-md-4 mt-4 mt-md-0 d-flex justify-content-center">
            <div className="mb-4 w-100 text-start">
              <h5>Habilidad</h5>
              <select
                className="form-select text-center text-white bg-dark"
                value={selectedAbility}
                onChange={(e) => setSelectedAbility(e.target.value)}
              >
                <option value="" className="bg-secondary">
                  Todas
                </option>
                {!loading &&
                  !error &&
                  abilities.map((ability) => (
                    <option
                      key={ability.id}
                      value={ability.id.toString()}
                      className="bg-secondary"
                    >
                      {ability.name}
                    </option>
                  ))}
                {loading && <option>Cargando...</option>}
                {error && <option>Error al cargar</option>}
              </select>
              <div className="mt-5 text-start">
                <h5>Altura</h5>
                <div className="d-flex justify-content-center gap-4 mb-5">
                  {heightOptions.map((option) => {
                    const isSelected = selectedHeights.includes(option.key);
                    return (
                      <div
                        key={option.key}
                        onClick={() => handleHeightToggle(option.key)}
                        style={{
                          width: "110px",
                          height: "110px",
                          backgroundColor: isSelected ? "#e03232" : "#efeff3",
                          border: "2px solid",
                          borderColor: isSelected ? "#e03232" : "#ccc",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? "#fff" : "#2b2b2f",
                          fontWeight: "bold",
                        }}
                      >
                        <img
                          src={option.imageUrl}
                          alt={option.label}
                          style={{
                            width:
                              option.label === "Chico"
                                ? "60px"
                                : option.label === "Medio"
                                ? "80px"
                                : "110px",
                            height:
                              option.label === "Pequeño"
                                ? "60px"
                                : option.label === "Medio"
                                ? "80px"
                                : "110px",
                            objectFit: "contain",
                            marginBottom: "5px",
                            transition: "all 0.3s ease",
                            filter: isSelected
                              ? "brightness(100) opacity(1)"
                              : "brightness(0) opacity(0.9)",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <h5>Peso</h5>
                <div className="d-flex justify-content-center gap-4">
                  {weightOptions.map((option) => {
                    const isSelected = selectedWeights.includes(option.key);
                    return (
                      <div
                        key={option.key}
                        onClick={() => handleWeightToggle(option.key)}
                        style={{
                          width: "110px",
                          height: "110px",
                          backgroundColor: isSelected ? "#e03232" : "#efeff3",
                          border: "2px solid",
                          borderColor: isSelected ? "#e03232" : "#ccc",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? "#fff" : "#2b2b2f",
                          fontWeight: "bold",
                          outline: "none", // Elimina el borde de enfoque
                          boxShadow: isSelected
                            ? "0 0 8px rgba(224, 50, 50, 0.8)"
                            : "none",
                        }}
                      >
                        <img
                          src={option.imageUrl}
                          alt={option.label}
                          style={{
                            width:
                              option.label === "Liviano"
                                ? "50px"
                                : option.label === "Medio"
                                ? "80px"
                                : "110px",
                            height:
                              option.label === "Liviano"
                                ? "50px"
                                : option.label === "Medio"
                                ? "80px"
                                : "110px",
                            objectFit: "contain",
                            marginBottom: "5px",
                            transition: "all 0.3s ease",
                            filter: isSelected
                              ? "brightness(100) opacity(1)"
                              : "brightness(0) opacity(0.9)",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center py-3 d-flex gap-3">
        <button
          className="btn btn-primary w-100 w-md-auto px-5 fs-5"
          onClick={onApplyFilters}
          style={{ backgroundColor: "#e03232" }}
        >
          Buscar<i className="ms-2 bi bi-search"></i>
        </button>
        <button
          className="btn btn-secondary w-50 lead fs-5"
          onClick={handleResetFilters}
        >
          Restablecer
        </button>
      </div>
    </>
  );
};

const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.substring(3, 4), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#2b2b2f" : "#FFFFFF";
};

export default AdvancedFilters;
