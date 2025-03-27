import React from "react";

interface StatsProps {
  stats: { base_stat: number; effort: number; stat: { name: string } }[];
}

const STAT_COLORS: Record<string, string> = {
  hp: "#ff5959",
  attack: "#f08030",
  defense: "#f8d030",
  "special-attack": "#6890f0",
  "special-defense": "#78c850",
  speed: "#f85888",
};
// Traducciones al español
const STAT_TRANSLATIONS: Record<string, string> = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defensa Especial",
  speed: "Velocidad",
};

const StatsDisplay: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="my-4 mx-3">
      <h5 className="text-body-secondary mb-3">Estadísticas</h5>
      <div>
        {stats.map(({ base_stat, stat }) => (
          <div key={stat.name} className="mb-2">
            <div className="d-flex justify-content-between">
              <span className="text-capitalize lead text-body-secondary">
                {STAT_TRANSLATIONS[stat.name] || stat.name.replace("-", " ")}
              </span>
              <span>{base_stat}</span>
            </div>
            <div
              className="progress"
              style={{ height: "8px", backgroundColor: "#ddd" }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(base_stat / 255) * 100}%`,
                  backgroundColor: STAT_COLORS[stat.name] || "#aaa",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDisplay;
