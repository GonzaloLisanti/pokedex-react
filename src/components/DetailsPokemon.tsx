import React, { JSX, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Pokemon,
  SpeciesData,
  TranslatedData,
  TypeData,
  APIResource,
} from "../interfaces/Pokemon";
import { TYPE_COLORS } from "../utils/Types";
import { getContrastColor } from "../utils/getContrastColor";
import StatsDisplay from "./StatsDisplay";
import { EN_TO_ES } from "../utils/Types";

// Para la cadena de evolución
interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

interface EvolutionChainData {
  chain: EvolutionChainLink;
}

interface EvolutionStage {
  id: number;
  name: string;
  image: string;
  types: string[];
}

// Nuevas interfaces para la habilidad
interface AbilityFlavorEntry {
  flavor_text: string;
  language: APIResource;
}

interface AbilityDetails {
  id: number;
  name: string;
  flavor_text_entries: AbilityFlavorEntry[];
}

/**
 * Busca en un arreglo la entrada para un idioma principal (pLang) y,
 * si no la encuentra, la del idioma secundario (sLang).
 */
function getByLanguage<T extends { language: { name: string } }>(
  items: T[],
  pLang: string,
  sLang: string
): T | undefined {
  return (
    items.find((item) => item.language.name === pLang) ||
    items.find((item) => item.language.name === sLang)
  );
}

/** Recorre la cadena de evolución de forma recursiva
 *  y retorna un array con los nombres de cada etapa.
 */
function parseEvolutionChain(
  chainLink: EvolutionChainLink,
  result: string[] = []
): string[] {
  result.push(chainLink.species.name);
  chainLink.evolves_to.forEach((nextLink) => {
    parseEvolutionChain(nextLink, result);
  });
  return result;
}

const DetailsPokemon: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<SpeciesData | null>(null);
  const [translatedTypes, setTranslatedTypes] = useState<string[]>([]);
  const [translatedAbilities, setTranslatedAbilities] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("red");

  // Estado para tooltip de habilidad
  const [abilityDetails, setAbilityDetails] = useState<AbilityDetails | null>(
    null
  );
  const [showAbilityTooltip, setShowAbilityTooltip] = useState<boolean>(false);

  // NUEVO: estado para la cadena de evolución
  const [evolutionData, setEvolutionData] = useState<EvolutionStage[]>([]);

  useEffect(() => {
    setSelectedVersion("red");
  }, [id]);

  // Cargar datos básicos y de especie
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const pokemonRes = await axios.get<Pokemon>(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(pokemonRes.data);

        const speciesRes = await axios.get<SpeciesData>(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        setSpecies(speciesRes.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError("Error al obtener los detalles del Pokémon: " + err.message);
        } else {
          setError("Error al obtener los detalles del Pokémon.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Cuando tengamos la especie, obtenemos la cadena de evolución
  useEffect(() => {
    if (species && species.evolution_chain) {
      const evoUrl = species.evolution_chain.url;
      axios.get<EvolutionChainData>(evoUrl).then(async (res) => {
        const names = parseEvolutionChain(res.data.chain, []);
        const evoStages = await Promise.all(
          names.map(async (pokeName) => {
            try {
              const pokeRes = await axios.get<Pokemon>(
                `https://pokeapi.co/api/v2/pokemon/${pokeName}`
              );
              return {
                id: pokeRes.data.id,
                name: pokeRes.data.name,
                image:
                  pokeRes.data.sprites.other["official-artwork"].front_default,
                types: pokeRes.data.types.map((t) => t.type.name),
              };
            } catch {
              return {
                id: 0,
                name: pokeName,
                image: "",
                types: [],
              };
            }
          })
        );
        setEvolutionData(evoStages);
      });
    }
  }, [species]);

  // Obtener traducciones de tipos y habilidades (con fallback)
  useEffect(() => {
    if (pokemon) {
      // Tipos
      Promise.all(
        pokemon.types.map(async (t) => {
          try {
            const res = await axios.get<TranslatedData>(t.type.url);
            const entry = getByLanguage(res.data.names, "es", "en");
            return entry ? entry.name : t.type.name;
          } catch {
            return t.type.name;
          }
        })
      ).then((translated) => setTranslatedTypes(translated));

      // Habilidades
      Promise.all(
        pokemon.abilities.map(async (a) => {
          try {
            const res = await axios.get<TranslatedData>(a.ability.url);
            const entry = getByLanguage(res.data.names, "es", "en");
            return entry ? entry.name : a.ability.name;
          } catch {
            return a.ability.name;
          }
        })
      ).then((translated) => setTranslatedAbilities(translated));
    }
  }, [pokemon]);

  // Calcular debilidades
  useEffect(() => {
    if (pokemon) {
      const fetchWeaknesses = async () => {
        const weaknessSet = new Set<string>();
        await Promise.all(
          pokemon.types.map(async (t) => {
            try {
              const res = await axios.get<TypeData>(t.type.url);
              await Promise.all(
                res.data.damage_relations.double_damage_from.map(
                  async (weak) => {
                    try {
                      const weakRes = await axios.get<TranslatedData>(weak.url);
                      const entry = getByLanguage(
                        weakRes.data.names,
                        "es",
                        "en"
                      );
                      const weaknessName = entry ? entry.name : weak.name;
                      weaknessSet.add(weaknessName.toLowerCase());
                    } catch {
                      weaknessSet.add(weak.name);
                    }
                  }
                )
              );
            } catch {
              // Ignorar
            }
          })
        );
        setWeaknesses(Array.from(weaknessSet));
      };
      fetchWeaknesses();
    }
  }, [pokemon]);

  // Flavor text con fallback
  const getFlavorText = (): string => {
    if (!species) return "";
    const versionGroups: { [key: string]: string[] } = {
      red: ["red", "fire-red", "x", "scarlet", "sword"],
      blue: ["blue", "leaf-green", "y", "violet", "shield"],
    };
    // Primero en español
    const filteredEs = species.flavor_text_entries.filter(
      (entry) =>
        versionGroups[selectedVersion]?.includes(entry.version.name) &&
        entry.language.name === "es"
    );
    if (filteredEs.length > 0) {
      return filteredEs[0].flavor_text.replace(/\n|\f/g, " ");
    }
    // Fallback en inglés
    const filteredEn = species.flavor_text_entries.filter(
      (entry) =>
        versionGroups[selectedVersion]?.includes(entry.version.name) &&
        entry.language.name === "en"
    );
    if (filteredEn.length > 0) {
      return filteredEn[0].flavor_text.replace(/\n|\f/g, " ");
    }
    return "Descripción no disponible";
  };

  const getCategory = (): string => {
    if (!species) return "";
    const genusEntry = getByLanguage(species.genera, "es", "en");
    return genusEntry
      ? genusEntry.genus.replace(/^Pokémon\s+/i, "")
      : "Desconocido";
  };

  const getGenderInfo = (): JSX.Element => {
    if (!species) return <></>;
    if (species.gender_rate === -1) return <span>Desconocido</span>;
    return (
      <span>
        <i className="bi bi-gender-male me-2"></i>
        <i className="bi bi-gender-female"></i>
      </span>
    );
  };

  // Efecto para obtener detalles de la habilidad principal
  useEffect(() => {
    if (pokemon) {
      const primaryAbility =
        pokemon.abilities.find((a) => !a.is_hidden) || pokemon.abilities[0];
      const fetchAbilityDetails = async () => {
        try {
          const res = await axios.get<AbilityDetails>(
            primaryAbility.ability.url
          );
          setAbilityDetails(res.data);
        } catch (error: unknown) {
          console.error("Error al obtener detalles de la habilidad", error);
        }
      };
      fetchAbilityDetails();
    }
  }, [pokemon]);

  if (loading) {
    return (
      <div
        className="container-md d-flex justify-content-center"
        style={{ marginTop: "100px", maxWidth: "960px" }}
      >
        <p className="loader"></p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="container text-center p-5">
        {error || "No se encontraron detalles"}
      </div>
    );
  }

  // Seleccionar la habilidad principal
  const primaryAbilityObj =
    pokemon.abilities.find((a) => !a.is_hidden) || pokemon.abilities[0];
  const primaryAbilityIndex = pokemon.abilities.findIndex((a) => !a.is_hidden);
  const displayedAbility =
    translatedAbilities.length > 0 && primaryAbilityIndex !== -1
      ? translatedAbilities[primaryAbilityIndex]
      : primaryAbilityObj.ability.name.replace("-", " ");

  return (
    <div
      className="container-md"
      style={{ marginTop: "100px", maxWidth: "960px" }}
    >
      {/* Encabezado */}
      <div className="d-flex align-items-baseline mb-4 justify-content-center">
        <h1 className="display-4 mb-0 me-2">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h1>
        <span className="fs-3 text-body-secondary">
          #{pokemon.id.toString().padStart(4, "0")}
        </span>
      </div>

      {/* Contenido principal */}
      <div className="row g-4">
        {/* Columna de imagen */}
        <div className="col-md-5 mx-auto text-center">
          {pokemon.types && (
            <div
              className="position-relative"
              style={{
                padding: "4px",
                background:
                  pokemon.types.length > 1
                    ? `linear-gradient(90deg, ${
                        TYPE_COLORS[
                          EN_TO_ES[pokemon.types[0].type.name.toLowerCase()] ||
                            "Normal"
                        ]
                      } 0%, ${
                        TYPE_COLORS[
                          EN_TO_ES[pokemon.types[1].type.name.toLowerCase()] ||
                            "Normal"
                        ]
                      } 100%)`
                    : TYPE_COLORS[
                        EN_TO_ES[pokemon.types[0].type.name.toLowerCase()] ||
                          "Normal"
                      ],
                borderRadius: "12px",
                boxShadow: `
          0 0 20px 5px ${
            TYPE_COLORS[
              EN_TO_ES[pokemon.types[0].type.name.toLowerCase()] || "Normal"
            ]
          }80
          ${
            pokemon.types.length > 1
              ? `, 0 0 20px 5px ${
                  TYPE_COLORS[
                    EN_TO_ES[pokemon.types[1].type.name.toLowerCase()] ||
                      "Normal"
                  ]
                }80`
              : ""
          }
        `,
                transition: "all 0.3s ease",
              }}
            >
              <div
                className="position-relative"
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "2px",
                  overflow: "hidden",
                }}
              >
                <div className="d-flex justify-content-center">
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default
                    }
                    alt={pokemon.name}
                    className="img-fluid mx-auto"
                    style={{
                      maxWidth: "400px",
                      width: "100%",
                      maxHeight: "70vh",
                      borderRadius: "6px",
                      padding: "8px",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Estadísticas */}
          {pokemon.stats && (
            <div className="mt-2 pt-3">
              <StatsDisplay stats={pokemon.stats} />
            </div>
          )}
        </div>
        {/* Columna de detalles */}
        <div className="col-md-7 ps-md-4">
          {/* Descripción */}
          <p className="lead mb-2">{getFlavorText()}</p>

          {/* Versiones */}
          <div className="d-flex gap-3 my-4 align-items-center">
            <p className="mb-0 lead">Versiones:</p>
            <button
              className={`btn justify-content-center d-flex btn-danger ${
                selectedVersion === "red" ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => setSelectedVersion("red")}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            >
              <img
                src="/images/pokebola.png"
                alt="Versión Roja"
                style={{
                  width: "30px",
                  filter:
                    selectedVersion === "blue" ? "none" : "grayscale(100%)",
                }}
              />
            </button>
            <button
              className={`btn btn-primary justify-content-center d-flex ${
                selectedVersion === "blue" ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => setSelectedVersion("blue")}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            >
              <img
                src="/images/pokebola.png"
                alt="Versión Azul"
                style={{
                  width: "30px",
                  filter:
                    selectedVersion === "blue" ? "none" : "grayscale(100%)",
                }}
              />
            </button>
          </div>

          {/* Detalles principales */}
          <div
            className="row g-1 py-4 rounded bg-gradient"
            style={{ backgroundColor: "#ff3b30" }}
          >
            <div className="col-5 px-5">
              <dl className="mb-0">
                <dt className="text-white fs-6">Altura</dt>
                <dd className="lead fs-5">
                  {(pokemon.height / 10).toFixed(1)} m
                </dd>
                <dt className="text-white fs-6 mt-2">Peso</dt>
                <dd className="lead fs-5">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </dd>
                <dt className="text-white fs-6">Género</dt>
                <dd className="lead fs-5">{getGenderInfo()}</dd>
              </dl>
            </div>
            <div className="col-7">
              <dl className="mb-0">
                <dt className="text-white fs-6">Habilidad</dt>
                <dd
                  className="lead fs-5"
                  style={{ position: "relative", display: "inline-block" }}
                >
                  {displayedAbility}{" "}
                  <i
                    className="bi bi-question-circle"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAbilityTooltip((prev) => !prev)}
                  ></i>
                  {showAbilityTooltip && abilityDetails && (
                    <div
                      className="custom-tooltip"
                      style={{
                        position: "absolute",
                        top: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#fff",
                        color: "#333",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                        width: "250px",
                        maxWidth: "80vw",
                      }}
                    >
                      {abilityDetails.flavor_text_entries
                        .find((entry) => entry.language.name === "es")
                        ?.flavor_text.replace(/\n|\f/g, " ") ||
                        abilityDetails.flavor_text_entries
                          .find((entry) => entry.language.name === "en")
                          ?.flavor_text.replace(/\n|\f/g, " ") ||
                        "Sin descripción disponible."}
                    </div>
                  )}
                </dd>

                <dt className="text-white fs-6 mt-2">Categoría</dt>
                <dd className="lead fs-5">{getCategory()}</dd>
              </dl>
            </div>
          </div>

          {/* Tipos */}
          <div className="mt-2 pt-3">
            <h5 className="text-body-secondary mb-3">Tipo</h5>
            <div className="d-flex gap-2">
              {translatedTypes.length > 0
                ? translatedTypes.map((typeName, index) => (
                    <span
                      key={index}
                      className="badge fs-6 py-2 text-capitalize"
                      style={{
                        backgroundColor: TYPE_COLORS[typeName] || "#ececf0",
                        color: getContrastColor(
                          TYPE_COLORS[typeName] || "#ececf0"
                        ),
                      }}
                    >
                      {typeName}
                    </span>
                  ))
                : pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className="badge fs-6 py-2 text-capitalize"
                      style={{
                        backgroundColor:
                          TYPE_COLORS[type.type.name] || "#ececf0",
                        color: getContrastColor(
                          TYPE_COLORS[type.type.name] || "#ececf0"
                        ),
                      }}
                    >
                      {type.type.name}
                    </span>
                  ))}
            </div>
          </div>

          {/* Debilidades */}
          <div className="mt-2 pt-3 mb-4">
            <h5 className="text-body-secondary mb-3">Debilidad</h5>
            <div className="d-flex gap-2 flex-wrap">
              {weaknesses.length > 0 ? (
                weaknesses.map((weakness, index) => (
                  <span
                    key={index}
                    className="badge fs-6 py-2 text-capitalize"
                    style={{
                      backgroundColor:
                        TYPE_COLORS[
                          weakness.charAt(0).toUpperCase() +
                            weakness.slice(1).toLowerCase()
                        ] || "#ececf0",
                      color: getContrastColor(
                        TYPE_COLORS[
                          weakness.charAt(0).toUpperCase() +
                            weakness.slice(1).toLowerCase()
                        ] || "#ececf0"
                      ),
                    }}
                  >
                    {weakness}
                  </span>
                ))
              ) : (
                <span className="badge bg-secondary bg-opacity-25 text-dark fs-6 py-2">
                  Sin debilidades
                </span>
              )}
            </div>
          </div>
        </div>
        {/* CADENA DE EVOLUCIÓN */}
        {evolutionData.length > 0 && (
          <div
            className="mt-4 p-3 rounded bg-gradient"
            style={{ backgroundColor: "#828282" }}
          >
            <h5 className="lead mb-3 text-white text-center">Evoluciones</h5>

            <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch flex-wrap gap-3">
              {evolutionData.length === 1 ? (
                <div className="text-center">
                  <div className="d-inline-block position-relative">
                    <img
                      src={
                        pokemon.sprites.other["official-artwork"].front_default
                      }
                      alt={pokemon.name}
                      className="img-fluid"
                      style={{
                        width: "clamp(100px, 20vw, 150px)",
                        height: "clamp(100px, 20vw, 150px)",
                        objectFit: "contain",
                        border: "3px solid #ff3b30",
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                  <p className="text-white mb-1 lead mt-2 text-capitalize">
                    {pokemon.name}
                  </p>
                  <small className="text-body-secondary">
                    N° {pokemon.id.toString().padStart(4, "0")}
                  </small>

                  <div className="d-flex justify-content-center gap-1 flex-wrap mt-2">
                    {translatedTypes.map((typeName, index) => (
                      <span
                        key={index}
                        className="badge fs-7 py-1 text-capitalize"
                        style={{
                          backgroundColor: TYPE_COLORS[typeName] || "#ececf0",
                          color: getContrastColor(
                            TYPE_COLORS[typeName] || "#ececf0"
                          ),
                        }}
                      >
                        {typeName}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                evolutionData.map((stage, idx) => (
                  <React.Fragment key={stage.id}>
                    <div className="d-flex flex-column flex-md-row align-items-center">
                      {/* Contenedor de la etapa */}
                      <div className="text-center mx-2">
                        <img
                          src={stage.image}
                          alt={stage.name}
                          className="img-fluid"
                          style={{
                            width: "clamp(150px, 15vw, 150px)",
                            height: "clamp(150px, 15vw, 150px)",
                            objectFit: "contain",
                            border: "3px solid #ff3b30",
                            borderRadius: "50%",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            backgroundColor: "#ffffff",
                          }}
                        />
                        <p className="text-white mb-0 small mt-1 text-capitalize">
                          {stage.name}
                        </p>
                        <small className="text-body-secondary">
                          N° {stage.id.toString().padStart(4, "0")}
                        </small>
                        <div className="d-flex justify-content-center gap-1 flex-wrap mt-1">
                          {stage.types.map((tipoIngles) => {
                            const tipoEsp =
                              EN_TO_ES[tipoIngles.toLowerCase()] ||
                              "Desconocido";
                            return (
                              <span
                                key={tipoIngles}
                                className="badge fs-7 py-1 text-capitalize"
                                style={{
                                  backgroundColor:
                                    TYPE_COLORS[tipoEsp] || "#ececf0",
                                  color: getContrastColor(
                                    TYPE_COLORS[tipoEsp] || "#ececf0"
                                  ),
                                }}
                              >
                                {tipoEsp}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Flechas separadas para mobile/desktop */}
                      {idx < evolutionData.length - 1 && (
                        <>
                          {/* Flecha desktop (derecha) */}
                          <div className="d-none d-md-flex align-items-center mx-3">
                            <i className="bi bi-arrow-right fs-2 text-white" />
                          </div>

                          {/* Flecha mobile (abajo) */}
                          <div className="d-md-none my-3">
                            <i className="bi bi-arrow-down fs-3 text-white" />
                          </div>
                        </>
                      )}
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        )}
        <div className="d-flex justify-content-end mb-4">
          <Link to={"/pokédex"}>
            <button
              className="btn border text-white py-2 px-4"
              style={{ backgroundColor: "#ff3b30" }}
            >
              Ir a la Pokédex
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailsPokemon;
