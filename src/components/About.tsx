import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-5" style={{ marginTop: "90px" }}>
      <div className="card shadow-lg p-4 w-100">
        <h1 className="display-4 mb-4 text-danger">
          <i className="bi bi-info-circle-fill me-3"></i>
          Acerca de la Pokédex Digital
        </h1>

        <div className="mb-4">
          <h2 className="h4 mb-3 text-primary">
            <i className="bi bi-database me-2"></i>
            Sobre los datos
          </h2>
          <p className="lead">
            Esta aplicación utiliza la
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fw-bold mx-2"
              style={{ color: "#ef5350" }}
            >
              PokéAPI
            </a>
            como fuente principal de información. Todos los datos de Pokémon,
            incluyendo estadísticas, tipos y evoluciones, son obtenidos
            directamente desde esta API pública.
          </p>
        </div>

        <div className="mb-4">
          <h2 className="h4 mb-3 text-warning">
            <i className="bi bi-translate me-2"></i>
            Nota sobre los idiomas
          </h2>
          <p className="alert alert-warning">
            Algunos contenidos pueden aparecer en inglés debido a que la PokéAPI
            no mantiene actualizadas todas las traducciones al español.
          </p>
        </div>

        <div className="mb-4">
          <h2 className="h4 mb-3 text-success">
            <i className="bi bi-code-square me-2"></i>
            Desarrollo técnico
          </h2>
          <div className="row">
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item">
                  <i className="bi bi-filetype-tsx me-2"></i>
                  Desarrollado con React y TypeScript
                </li>
                <li className="list-group-item">
                  <i className="bi bi-bootstrap-fill me-2"></i>
                  Estilos con Bootstrap 5
                </li>
                <li className="list-group-item">
                  <i className="bi bi-github me-2"></i>
                  Gestión de estado con React Hooks
                </li>
              </ul>
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card bg-light w-75">
                <div className="card-body">
                  <h5 className="card-title">Características principales</h5>
                  <ul>
                    <li>Búsqueda avanzada de Pokémon</li>
                    <li>Detalles completos de estadísticas</li>
                    <li>Sistema de evoluciones interactivo</li>
                    <li>Diseño completamente responsive</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="h4 mb-3 text-info">
            <i className="bi bi-heart-fill me-2"></i>
            Agradecimientos
          </h2>
          <p>
            Este proyecto es posible gracias a:
            <ul className="list-unstyled ms-4">
              <li>
                <i className="bi bi-arrow-right-circle me-2"></i>
                Equipo de desarrollo de la
                <a
                  href="https://pokeapi.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none mx-2"
                >
                  PokéAPI
                </a>
              </li>
              <li>
                <i className="bi bi-arrow-right-circle me-2"></i>
                Comunidad Pokémon por su apoyo
              </li>
            </ul>
          </p>
        </div>

        <div className="alert alert-dark mt-4">
          <h3 className="h5">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Aviso legal
          </h3>
          <small>
            Pokémon y todos los nombres relacionados son marcas registradas de
            Nintendo, Game Freak y The Pokémon Company. Esta aplicación no tiene
            afiliación alguna ni está respaldada por estas entidades.
            Desarrollado con fines educativos y sin ánimo de lucro.
          </small>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="btn btn-danger btn-lg">
            <i className="bi bi-arrow-left-circle me-2"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
