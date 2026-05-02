import { Volume2, Type, Timer, Trash2 } from "lucide-react";

export default function Settings({ settings, setSettings }) {
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 px-6 pb-32 animate-in fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-serif">Ajustes</h1>
        <p className="text-gray-500 text-sm font-sans">Personalize sua jornada de leitura</p>
      </header>

      <div className="space-y-6">
        {/* SEÇÃO: ÁUDIO */}
        <section className="bg-[#1a1d23] p-6 rounded-[2rem] border border-white/5 space-y-6">
          <div className="flex items-center gap-3 text-blue-500">
            <Volume2 size={20} />
            <h2 className="font-bold uppercase text-[10px] tracking-widest font-sans">Sons Ambiente</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-gray-400">Intensidade do Volume</span>
              <span className="text-blue-400 font-bold">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01"
              value={settings.volume}
              onChange={(e) => updateSetting("volume", parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
              <Timer size={14} /> <span>Desligar automaticamente em:</span>
            </div>
            <div className="flex gap-2">
              {[0, 15, 30, 60].map(min => (
                <button 
                  key={min}
                  onClick={() => updateSetting("sleepTimer", min)}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    settings.sleepTimer === min 
                    ? "bg-blue-600 border-blue-400 text-white" 
                    : "bg-gray-800 border-white/5 text-gray-500 hover:bg-gray-700 cursor-pointer"
                  }`}
                >
                  {min === 0 ? "Off" : `${min}m`}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1a1d23] p-6 rounded-[2rem] border border-white/5 space-y-6 font-sans">
          <div className="flex items-center gap-3 text-purple-500">
            <Type size={20} />
            <h2 className="font-bold uppercase text-[10px] tracking-widest">Tipografia</h2>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-gray-400">Estilo da Fonte</span>
            <div className="flex gap-2">
              <button 
                onClick={() => updateSetting("fontFamily", "font-serif")}
                className={`flex-1 py-4 rounded-2xl border font-serif transition-all ${
                  settings.fontFamily === "font-serif" 
                  ? "bg-purple-600 border-purple-400 text-white" 
                  : "bg-gray-800 border-white/5 text-gray-500 cursor-pointer"
                }`}
              >
                Serifada
              </button>
              <button 
                onClick={() => updateSetting("fontFamily", "font-sans")}
                className={`flex-1 py-4 rounded-2xl border font-sans transition-all ${
                  settings.fontFamily === "font-sans" 
                  ? "bg-purple-600 border-purple-400 text-white" 
                  : "bg-gray-800 border-white/5 text-gray-500 cursor-pointer"
                }`}
              >
                Sans-Serif
              </button>
            </div>
          </div>
        </section>

        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="w-full p-5 bg-red-500/5 text-red-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border border-red-500/10 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
        >
          <Trash2 size={14} /> Resetar cache do sistema
        </button>
      </div>
    </div>
  );
}
