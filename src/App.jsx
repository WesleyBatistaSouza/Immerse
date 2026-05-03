import "./index.css";
import {
  Book,
  Plus,
  Settings as SettingsIcon,
  ListMusic,
  X,
  Trophy,
} from "lucide-react";

import Notification, {
  notifyError,
  notifySuccess,
} from "./core/notification.jsx";

import { useState, useRef, useEffect, useMemo } from "react";

import Reader from "./pages/reader.jsx";
import Import from "./pages/import.jsx";
import Library from "./pages/library.jsx";
import SoundPage, { MiniPlayer } from "./pages/sons.jsx";
import Settings from "./pages/settings.jsx";
import Achievements from "./pages/achievements.jsx";

import themes from "./data/data_themes.jsx";
import livrosEstaticos from "./data/data_books.jsx";

import { useLibraryEngine } from "./hooks/useLibraryEngine";

function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("immerse-settings");
    return saved
      ? JSON.parse(saved)
      : {
          volume: 0.5,
          fontFamily: "font-serif",
          fontSize: "text-lg",
          auraIntensity: 0.15,
          sleepTimer: 0,
        };
  });

  const [activeTab, setActiveTab] = useState("livraria");
  const [isReading, setIsReading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themes.default);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // =========================
  // ENGINE DE LIVRARIA
  // =========================
  const {
    userBooks,
    loadBooks,
    addBook,
    deleteBook,
    toggleFavorite,
    updateProgress,
  } = useLibraryEngine();

  useEffect(() => {
    loadBooks();
  }, []);

  const allBooks = useMemo(() => {
  return [...livrosEstaticos, ...userBooks];
}, [userBooks]);

  // =========================
  // ÁUDIO GLOBAL
  // =========================
  useEffect(() => {
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // =========================
  // SALVAR SETTINGS
  // =========================
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume;
    }

    localStorage.setItem("immerse-settings", JSON.stringify(settings));
  }, [settings]);

  // =========================
  // SLEEP TIMER
  // =========================
  useEffect(() => {
    if (settings.sleepTimer > 0 && isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
        setSettings((prev) => ({ ...prev, sleepTimer: 0 }));
      }, settings.sleepTimer * 60 * 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [settings.sleepTimer, isPlaying]);

  // =========================
  // PLAYER DE SOM
  // =========================
  const handleToggleSound = (sound) => {
    if (!sound) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (currentSound?.id === sound.id) {
      if (isPlaying) audio.pause();
      else audio.play();

      setIsPlaying(!isPlaying);
    } else {
      audio.pause();
      audio.src = sound.url;
      audio.loop = true;
      audio.volume = settings.volume;

      audio.play().catch((err) => console.error("Erro ao tocar áudio:", err));

      setCurrentSound(sound);
      setIsPlaying(true);
    }
  };

  // =========================
  // ABRIR LIVRO
  // =========================
  const openBook = (book) => {
    setCurrentBook(book);
    setCurrentTheme(themes[book.category] || themes.default);
    setIsReading(true);
  };

  // =========================
  // ADICIONAR LIVRO
  // =========================
  const handleAddBook = async (newBook) => {
    try {
      await addBook(newBook);

      await Achievements("first_import");
      await Achievements("book_collector");
      await Achievements("library_master");

      notifySuccess("Livro adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao adicionar livro.");
    }
  };

  // =========================
  // FAVORITAR LIVRO
  // =========================
  const handleToggleFavorite = async (id) => {
    try {
      const becameFavorite = await toggleFavorite(id);

      if (becameFavorite) {
        await Achievements("first_favorite");
      }
    } catch (error) {
      console.error(error);
      notifyError("Erro ao favoritar livro.");
    }
  };

  // =========================
  // EXCLUIR LIVRO
  // =========================
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      notifySuccess("Livro excluído com sucesso!");
    } catch (error) {
      console.error(error);
      notifyError("Erro ao excluir livro.");
    }
  };

  // =========================
  // ATUALIZAR PROGRESSO
  // =========================
  const handleUpdateProgress = async (bookId, currentPage, totalPages) => {
    try {
      const completed = await updateProgress(bookId, currentPage, totalPages);

      if (completed) {
        await Achievements("first_finish");
        await Achievements("bookworm");
        await Achievements("reading_master");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // RENDER DE TELAS
  // =========================
  const renderContent = () => {
    switch (activeTab) {
      case "livraria":
        return (
          <Library
            onOpenBook={openBook}
            livros={allBooks}
            onToggleFavorite={handleToggleFavorite}
            onDeleteBook={handleDeleteBook}
          />
        );

      case "sons":
        return (
          <SoundPage
            onToggleSound={handleToggleSound}
            activeSoundId={currentSound?.id}
            isPlaying={isPlaying}
          />
        );

      case "importar":
        return <Import onAddBook={handleAddBook} />;

      case "conquistas":
        return <Achievements />;

      case "ajustes":
        return <Settings settings={settings} setSettings={setSettings} />;

      default:
        return null;
    }
  };

  const menuItems = [
    { id: "livraria", label: "Livraria", icon: Book },
    { id: "sons", label: "Sons", icon: ListMusic },
    { id: "importar", label: "Importar", icon: Plus },
    { id: "conquistas", label: "Conquistas", icon: Trophy },
    { id: "ajustes", label: "Ajustes", icon: SettingsIcon },
  ];

  return (
    <div className={`relative min-h-screen bg-[#0f1115] text-white flex flex-col overflow-x-hidden ${settings.fontFamily}`}>
      <Notification />

      <MiniPlayer
        isReading={isReading}
        currentTheme={currentTheme}
        currentSound={currentSound}
        isPlaying={isPlaying}
        onToggle={() => handleToggleSound(currentSound)}
        onToggleSound={handleToggleSound}
      />

      <main className={`flex-1 flex flex-col items-center transition-all duration-700 ${isReading ? "p-0" : "p-6 pb-32"}`}>
        {isReading ? (
          <div className="animate-in zoom-in-95 min-h-screen w-full flex flex-col items-center bg-[#0f1115]">
            <button
              onClick={() => setIsReading(false)}
              className="fixed top-6 left-6 text-white hover:text-blue-400 flex items-center gap-3 text-xs font-bold tracking-wider z-[60] bg-black/80 backdrop-blur-md p-3 px-6 rounded-full border border-white/20 uppercase cursor-pointer transition-all hover:scale-105 shadow-xl"
            >
              <X size={18} />
              Fechar
            </button>

            {currentBook && (
              <Reader
                book={currentBook}
                onProgressUpdate={handleUpdateProgress}
              />
            )}
          </div>
        ) : (
          renderContent()
        )}
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 p-4 transition-all duration-500 ${isReading ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        <nav className="max-w-md mx-auto bg-[#1a1d23]/90 backdrop-blur-lg border border-white/10 p-4 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-around items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 group outline-none cursor-pointer"
              >
                <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "group-hover:bg-gray-800"}`}>
                  <item.icon
                    size={22}
                    className={activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-white"}
                  />
                </div>

                <span className={`text-[10px] uppercase tracking-widest ${activeTab === item.id ? "text-blue-400 font-bold" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </footer>
    </div>
  );
}

export default App;