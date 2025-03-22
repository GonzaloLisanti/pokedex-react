// components/AdvancedFilters.tsx
import React from "react";

const AdvancedFilters: React.FC = () => {
  return (
    <div className="collapse w-100" id="collapseFilters">
      <div
        className="p-3 text-white"
        style={{
          backgroundColor: "#494a51",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        Filtros avanzados
      </div>
    </div>
  );
};

export default AdvancedFilters;
