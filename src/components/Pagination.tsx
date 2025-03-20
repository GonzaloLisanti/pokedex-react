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
    <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 py-3">
      {/* Botón Anterior */}
      <button
        className="btn btn-primary px-2 btn-lg"
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
            className={`btn ${
              page === currentPage ? "btn-danger" : "btn-outline-primary"
            } px-2 btn-lg`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="text-muted">
            ...
          </span>
        )
      )}

      {/* Botón Siguiente */}
      <button
        className="btn btn-primary px-2 btn-lg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="bi bi-caret-right-fill"></i>
      </button>
    </div>
  );
};

export default Pagination;
