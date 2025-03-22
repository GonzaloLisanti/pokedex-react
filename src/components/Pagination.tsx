import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPagesToShow = window.innerWidth < 576 ? 3 : 5; // Muestra menos páginas en móviles

  const getPages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 py-3 rounded-top bg-gradient">
      {/* Botón Anterior */}
      <button
        className="btn px-2 btn-lg"
        style={{
          background: "linear-gradient(to bottom, #D32F2F 50%, #FFFFFF 50%)",
          border: "2px solid black",
          color: "#000",
        }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="bi bi-caret-left-fill"></i>
      </button>

      {/* Números de página */}
      {getPages().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            className="btn px-3 btn-lg"
            style={{
              background:
                page === currentPage
                  ? "linear-gradient(to bottom, #9c1818 50%, #E0E0E0 50%)"
                  : "linear-gradient(to bottom, #D32F2F 50%, #FFFFFF 50%)",
              border: "2px solid black",
              color: "#000",
              fontWeight: "bold",
            }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="text-muted fs-5  ">
            ...
          </span>
        )
      )}

      {/* Botón Siguiente */}
      <button
        className="btn px-2 btn-lg"
        style={{
          background: "linear-gradient(to bottom, #D32F2F 50%, #FFFFFF 50%)",
          border: "2px solid black",
          color: "#000",
        }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="bi bi-caret-right-fill"></i>
      </button>
    </div>
  );
};

export default Pagination;
