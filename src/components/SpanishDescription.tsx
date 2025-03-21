// components/SpanishDescription.tsx
import { getSpanishName } from '../utils/translate';
import {DescriptionEntry } from '../interfaces/Pokemon'

interface SpanishDescriptionProps {
  descriptions: DescriptionEntry[];
}

// components/SpanishDescription.tsx
const SpanishDescription: React.FC<SpanishDescriptionProps> = ({ descriptions }) => {
    const translatedEntries = descriptions.map(d => ({
      language: d.language,
      name: d.flavor_text
    }));
    
    const spanishDescription = getSpanishName(translatedEntries);
    
    return spanishDescription ? <p className="text-muted small">{spanishDescription}</p> : null;
  };
  
  export default SpanishDescription;