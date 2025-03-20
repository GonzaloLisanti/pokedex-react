import React, { useEffect, useState } from "react";
import logo from "/images/PokeLogo.svg.png";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [bgColor, setBgColor] = useState("transparent");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPokedex, setIspokedex] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    if (currentPath === "/pok%C3%A9dex") {
      setIspokedex(true);
    }else{
      setIspokedex(false);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPath, setIspokedex]);

  useEffect(() => {
    setBgColor(isOpen || isScrolled ? "rgba(255, 59, 48, 0.9)" : "transparent");
  }, [isOpen, isScrolled]);

  const linkHoverColor = bgColor === "transparent" ? "#FFCC00" : "white";

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        backgroundColor: bgColor,
        transition: "1s ease-in-out",
        padding: "10px 20px",
        zIndex: 1000,
        minHeight: isOpen ? "200px" : "60px", // 💡 El navbar crece con el menú
        display: "flex",
        alignItems: "center",
        borderBottom: isPokedex ? "groove 1px" : "",
        boxShadow: isScrolled ? "0px 5px 10px rgba(0, 0, 0, 0.2)" : "",
      }}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo Pokémon" height="50px" />
        </Link>

        {/* Botón Toggle para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú responsive */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
          style={{
            width: "100%",
            transition: "1s ease-in-out", // 💡 Misma transición que el navbar
            backgroundColor: "inherit", // 💡 Hereda el color del navbar
            padding: isOpen ? "10px 0" : "0", // 💡 Suaviza la expansión
          }}
        >
          <div className="navbar-nav ms-4">
            {["Inicio", "Pokédex", "Acerca de"].map((text, index) => (
              <Link
                key={index}
                to={text === "Inicio" ? "/" : `/${text.toLowerCase()}`}
                className="nav-link me-3"
                style={{
                  color: "#FFCC00",
                  fontFamily: "'Helvetica', sans-serif",
                  textShadow: "1px 1px 2px rgb(4, 0, 255)",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = linkHoverColor)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FFCC00")}
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
