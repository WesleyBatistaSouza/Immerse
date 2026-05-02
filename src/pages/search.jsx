import { useState, useMemo } from "react";
import { Search as SearchIcon, X, BookOpen, Clock } from "lucide-react";

import livros from "../data/data_books.jsx";

export default function SearchPage({ onOpenBook }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return livros.filter(
      (libro) =>
        libro.title.toLowerCase().includes(query.toLowerCase()) ||
        libro.author.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
          Pesquisar
        </h1>

        <div className="relative group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Título, autor ou categoria..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1a1d23] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-800 rounded-full text-gray-500 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="space-y-4">
        {!query ? (
          <div className="text-center py-20">
            <Clock className="mx-auto text-gray-800 mb-4" size={48} />
            <p className="text-gray-500">
              Encontre seu livro para próxima leitura.
            </p>
          </div>
        ) : results.length > 0 ? (
          results.map((libro) => (
            <article
              key={libro.id}
              onClick={() => onOpenBook(libro)}
              className="group flex items-center gap-4 bg-[#1a1d23]/40 hover:bg-[#1a1d23] border border-white/5 p-3 rounded-2xl transition-all cursor-pointer"
            >
              <img
                src={libro.cover}
                alt={libro.title}
                className="w-16 h-20 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">
                  {libro.title}
                </h3>
                <p className="text-gray-500 text-sm">{libro.author}</p>
                <span className="text-[10px] text-blue-500/80 font-black uppercase tracking-widest">
                  {libro.category}
                </span>
              </div>
              <BookOpen
                size={20}
                className="text-gray-700 group-hover:text-blue-500 transition-all mr-2"
              />
            </article>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">
              Nenhum resultado encontrado para "
              <span className="text-white">{query}</span>".
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Tente verificar a ortografia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}