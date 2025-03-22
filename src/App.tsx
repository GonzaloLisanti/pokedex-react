import "./App.css";
import "./css/PokeballBackground.css";
import "./css/PokedexTitle.css";
import "./css/Loader.css";
import "./css/Card.css";
import "./css/Suggestions.css";
import "./css/PokeballShaking.css"

import IndexRouter from "./routes/IndexRouter";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <IndexRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
