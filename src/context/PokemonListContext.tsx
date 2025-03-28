import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Pokemon } from "../interfaces/Pokemon";

interface PokemonListContextType {
  finalPokemonList: Pokemon[];
  setFinalPokemonList: Dispatch<SetStateAction<Pokemon[]>>;
  displayCount: number;
  setDisplayCount: Dispatch<SetStateAction<number>>;
}

const PokemonListContext = createContext<PokemonListContextType | undefined>(
  undefined
);

export const PokemonListProvider = ({ children }: { children: ReactNode }) => {
  const [finalPokemonList, setFinalPokemonList] = useState<Pokemon[]>(() => {
    const storedList = localStorage.getItem("finalPokemonList");
    return storedList ? JSON.parse(storedList) : [];
  });
  const [displayCount, setDisplayCount] = useState<number>(() => {
    const storedCount = localStorage.getItem("displayCount");
    return storedCount ? Number(storedCount) : 20;
  });

  useEffect(() => {
    localStorage.setItem("finalPokemonList", JSON.stringify(finalPokemonList));
  }, [finalPokemonList]);

  useEffect(() => {
    localStorage.setItem("displayCount", displayCount.toString());
  }, [displayCount]);

  return (
    <PokemonListContext.Provider
      value={{
        finalPokemonList,
        setFinalPokemonList,
        displayCount,
        setDisplayCount,
      }}
    >
      {children}
    </PokemonListContext.Provider>
  );
};

export const usePokemonList = () => {
  const context = useContext(PokemonListContext);
  if (!context) {
    throw new Error("usePokemonList must be used within a PokemonListProvider");
  }
  return context;
};
