import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedWeaknesses: string[];
  setSelectedWeaknesses: (weaknesses: string[]) => void;
  selectedAbility: string;
  setSelectedAbility: (ability: string) => void;
  selectedHeights: string[];
  setSelectedHeights: (heights: string[]) => void;
  selectedWeights: string[];
  setSelectedWeights: (weights: string[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<string>("");
  const [selectedHeights, setSelectedHeights] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{
        selectedTypes,
        setSelectedTypes,
        selectedWeaknesses,
        setSelectedWeaknesses,
        selectedAbility,
        setSelectedAbility,
        selectedHeights,
        setSelectedHeights,
        selectedWeights,
        setSelectedWeights,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
