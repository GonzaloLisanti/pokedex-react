import React from "react";
import { TYPE_COLORS } from "../utils/Types";

interface AdvancedFiltersProps {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedWeaknesses: string[];
  setSelectedWeaknesses: (weaknesses: string[]) => void;
  allTranslatedTypes: string[];
  onApplyFilters: () => void;
  handleResetFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  selectedTypes,
  setSelectedTypes,
  selectedWeaknesses,
  setSelectedWeaknesses,
  allTranslatedTypes,
  onApplyFilters,
  handleResetFilters,
}) => {
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
            <div className="mb-4 w-75">
              <h5>Habilidad</h5>
              <select className="form-select">
                <option>Todas</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center py-3 d-flex gap-3">
        <button
          className="btn btn-primary w-100 w-md-auto px-5 fs-5"
          onClick={onApplyFilters}
          style={{
            backgroundColor: "#e03232",
          }}
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
