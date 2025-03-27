import Navbar from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import PokeDex from "../pages/PokeDex";
import DetailsPokemon from "../components/DetailsPokemon";

const IndexRouter = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokédex" element={<PokeDex />} />
        <Route path="/detalle/:id" element={<DetailsPokemon/>}/>
        {/*<Route path="/acerca-de" element={<PokeDex />} />*/}
      </Routes>
    </>
  );
};

export default IndexRouter;
