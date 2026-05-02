import { Play, Pause, GripVertical, SkipForward, SkipBack } from "lucide-react";
import { motion } from "framer-motion";
import sounds from "../data/data_sounds.jsx";

/**
 * MINI PLAYER FLUTUANTE
 * Gerencia o som de forma persistente e permite troca de faixas
 */
export function MiniPlayer({ isReading, currentTheme, currentSound, isPlaying, onToggle, onToggleSound }) {
  if (!currentSound) return null;

  // Lógica para navegação entre as faixas sem precisar sair da aba atual
  const currentIndex = sounds.findIndex(s => s.id === currentSound.id);
  
  const playNext = () => {
    const nextIndex = (currentIndex + 1) % sounds.length;
    onToggleSound(sounds[nextIndex]);
  };

  const playPrev = () => {
    const prevIndex = (currentIndex - 1 + sounds.length) % sounds.length;
    onToggleSound(sounds[prevIndex]);
  };

  return (
    <motion.div 
      drag 
      dragMomentum={false} // Melhora o controle manual do arraste
      className={`fixed top-6 right-6 z-[100] transition-all duration-500 cursor-grab active:cursor-grabbing ${
        isReading 
          ? "opacity-5 hover:opacity-100 focus-within:opacity-100" 
          : "opacity-100"
      }`}
    >
      {/* Aura de fundo dinâmica */}
      <div 
        className="absolute inset-0 blur-[40px] rounded-full transition-colors duration-1000 scale-125"
        style={{ backgroundColor: isPlaying ? currentTheme.aura : 'transparent' }}
      ></div>

      {/* Container Principal com Glassmorphism Intenso */}
      <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-2 pr-5 rounded-[2rem] flex items-center gap-3 shadow-2xl w-[280px]">
        
        {/* Grip para indicação de arrasto */}
        <div className="text-white/20 pl-2">
          <GripVertical size={14} />
        </div>

        {/* Controles de Play/Skip */}
        <div className="flex items-center gap-1.5">
          <button onClick={playPrev} className="text-white/30 hover:text-white transition-colors cursor-pointer p-1">
            <SkipBack size={14} fill="currentColor" />
          </button>

          <button 
            onClick={onToggle}
            className={`shrink-0 p-3 rounded-2xl shadow-lg cursor-pointer hover:brightness-125 transition-all active:scale-90 flex items-center justify-center`}
            style={{ backgroundColor: currentTheme.primary.startsWith('#') || currentTheme.primary.startsWith('rgb') ? currentTheme.primary : '' }}
            /* Caso use classes do tailwind, a classe bg-${currentTheme.primary} deve estar no pai */
          >
            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
          </button>

          <button onClick={playNext} className="text-white/30 hover:text-white transition-colors cursor-pointer p-1">
            <SkipForward size={14} fill="currentColor" />
          </button>
        </div>

        {/* Info do Áudio */}
        <div className="flex-1 min-w-0">
          <p className={`text-[8px] font-black uppercase tracking-widest truncate opacity-80 ${currentTheme.text}`}>
            {isPlaying ? "Immersive Mode" : "Paused"}
          </p>
          <p className="text-xs text-white font-semibold truncate">
            {currentSound.name}
          </p>
        </div>

        {/* Visualizer Animado */}
        {isPlaying && (
          <div className="flex gap-[2px] items-end h-3 shrink-0">
            <motion.div 
              animate={{ height: [4, 10, 4] }} 
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-[2px] bg-white/40 rounded-full"
            />
            <motion.div 
              animate={{ height: [10, 4, 10] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-[2px] bg-white/60 rounded-full"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * PÁGINA DE SONS (MIXER)
 */
export default function SoundPage({ onToggleSound, activeSoundId, isPlaying }) {
  return (
    <div className="w-full max-w-2xl mx-auto pt-6 animate-in fade-in duration-700">
      <header className="mb-10 text-center md:text-left px-4">
        <h1 className="text-3xl font-bold text-white font-serif tracking-tight">Sons de Imersão</h1>
        <p className="text-gray-400 text-sm mt-1">Sintonize sua mente para a próxima grande história.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24 px-4">
        {sounds.map((sound) => {
          const Icon = sound.icon;
          const isActive = activeSoundId === sound.id && isPlaying;

          return (
            <button
              key={sound.id}
              onClick={() => onToggleSound(sound)}
              className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group cursor-pointer ${
                isActive 
                ? "bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20 scale-[1.02]" 
                : "bg-[#1a1d23] border-white/5 hover:border-blue-500/30"
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`p-3 rounded-2xl transition-colors ${isActive ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400 group-hover:text-blue-500"}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm transition-colors ${isActive ? "text-white" : "text-gray-300"}`}>
                    {sound.name}
                  </h3>
                  <p className={`text-[9px] uppercase font-black tracking-tighter ${isActive ? "text-blue-200" : "text-gray-600"}`}>
                    {isActive ? "Ativo agora" : "Ambiente"}
                  </p>
                </div>
              </div>
              
              <div className={`transition-all duration-300 ${isActive ? "scale-110 opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {isActive ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
