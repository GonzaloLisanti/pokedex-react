import Navbar from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import PokeDex from "../pages/PokeDex";

const IndexRouter = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokédex" element={<PokeDex />} />
        {/*<Route path="/acerca-de" element={<PokeDex />} />*/}
      </Routes>
    </>
  );
};

export default IndexRouter;
