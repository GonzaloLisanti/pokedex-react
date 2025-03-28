import "./App.css";
import "./css/PokeballBackground.css";
import "./css/PokedexTitle.css";
import "./css/Loader.css";
import "./css/Card.css";
import "./css/Suggestions.css";
import "./css/PokeballShaking.css";
import { FilterProvider } from "./context/FiltersContext";
import IndexRouter from "./routes/IndexRouter";
import { BrowserRouter } from "react-router-dom";
import { PokemonListProvider } from "./context/PokemonListContext";

function App() {
  return (
    <>
      <FilterProvider>
        <PokemonListProvider>
          <BrowserRouter>
            <IndexRouter />
          </BrowserRouter>
        </PokemonListProvider>
      </FilterProvider>
    </>
  );
}

export default App;
