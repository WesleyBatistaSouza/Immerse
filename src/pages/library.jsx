import { useState, useMemo, useEffect } from "react";
import {
  Book,
  Skull,
  Ghost,
  Sword,
  Baby,
  Heart,
  Search,
  X,
} from "lucide-react";

import DeleteBook from "../core/dialog_box.jsx";

const BOOKS_PER_PAGE = 6;

const getPlaceholderIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "terror":
      return <Skull size={36} className="opacity-40" />;
    case "fantasia":
      return <Sword size={36} className="opacity-40" />;
    case "distopia":
      return <Ghost size={36} className="opacity-40" />;
    case "infantil":
      return <Baby size={36} className="opacity-40" />;
    default:
      return <Book size={36} className="opacity-40" />;
  }
};

export default function Library({
  onOpenBook,
  livros = [],
  onToggleFavorite,
  onDeleteBook,
}) {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    return [
      "Todos",
      "Favoritos",
      ...new Set(livros.map((b) => b.category).filter(Boolean)),
    ];
  }, [livros]);

  const filteredBooks = useMemo(() => {
    let base = livros;

    if (category === "Favoritos") {
      base = base.filter((b) => b.favorite);
    } else if (category !== "Todos") {
      base = base.filter((b) => b.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();

      base = base.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q),
      );
    }

    return base;
  }, [livros, category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    return filteredBooks.slice(start, end);
  }, [filteredBooks, currentPage]);

  const handleCategory = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in duration-700 font-sans">
      <div className="pt-4 pb-6 md:pb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
          Welcome to <span className="text-blue-500">Immerse</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-lg">
          Importe seu livro! Sua leitura imersiva começa aqui.
        </p>
      </div>

      <header className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-2xl md:text-3xl font-bold text-white font-serif">
              Minha Estante
            </h4>
            <p className="text-gray-400 text-xs mt-0.5">
              Exibindo {filteredBooks.length} obras
            </p>
          </div>

          <div className="relative w-full sm:w-56">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Buscar título ou autor…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#1a1d23] border border-white/5 rounded-xl py-2 pl-9 pr-8 text-white text-xs placeholder:text-gray-600 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {cat === "Favoritos" ? "♥ Favoritos" : cat}
            </button>
          ))}
        </div>
      </header>

      {paginatedBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mx-auto">
            {paginatedBooks.map((livro) => (
              <article
                key={livro.id || livro.title}
                className="relative bg-[#1a1d23] border border-white/5 p-2 md:p-3 rounded-2xl group"
              >
                {livro.id != null && (
                  <div className="absolute top-4 right-4 z-30 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite?.(livro.id);
                      }}
                      className={`p-1.5 rounded-xl cursor-pointer ${
                        livro.favorite ? "bg-red-500 text-white" : "bg-black/40"
                      }`}
                    >
                      <Heart
                        size={13}
                        fill={livro.favorite ? "currentColor" : "none"}
                      />
                    </button>

                    <DeleteBook
                      bookTitle={livro.title}
                      onConfirm={() => onDeleteBook?.(livro.id)}
                    />
                  </div>
                )}

                <div onClick={() => onOpenBook(livro)} className="cursor-pointer">
                  <div className="overflow-hidden rounded-xl mb-2 md:mb-4 bg-gray-800 h-40 sm:h-52 lg:h-64 flex items-center justify-center relative">
                    {livro.coverUrl || livro.cover ? (
                      <img
                        src={livro.coverUrl || livro.cover}
                        alt={livro.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {getPlaceholderIcon(livro.category)}
                        <span className="text-[9px] text-gray-500 uppercase text-center px-3">
                          {livro.title}
                        </span>
                      </div>
                    )}

                    {livro.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${livro.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-blue-400 font-bold uppercase">
                    {livro.category}
                  </span>
                  <h2 className="text-sm md:text-lg font-bold text-white truncate">
                    {livro.title}
                  </h2>
                  <p className="text-xs text-gray-400 truncate">{livro.author}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center items-center gap-5 mt-10 mb-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-5 py-2 rounded-xl bg-gray-800 disabled:opacity-30 cursor-pointer text-xs font-bold"
            >
              ANTERIOR
            </button>

            <span className="text-xs text-gray-500 uppercase font-bold">
              Página {currentPage} de {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-5 py-2 rounded-xl bg-gray-800 disabled:opacity-30 cursor-pointer text-xs font-bold"
            >
              PRÓXIMA
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          Nenhum livro encontrado.
        </div>
      )}
    </section>
  );
}