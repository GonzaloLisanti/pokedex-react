import React from "react";
import Header from "../components/Header";

const Home: React.FC = () => {
  return (
    <div className="pokeball-background" style={{ padding: "20px" }}>
      <div className="container text-center">
        <Header />
      </div>
    </div>
  );
};

export default Home;
