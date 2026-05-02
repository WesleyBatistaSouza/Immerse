import { useState, useEffect } from "react";
import { Trophy, Lock, Star, BookOpen, Heart, Library } from "lucide-react";
import { db } from "../data_base/db";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    favorites: 0,
    unlockedAchievements: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadAchievements();
    // eslint-disable-next-line react-hooks/immutability
    loadStats();
  }, []);

  async function loadAchievements() {
    try {
      const data = await db.achievements.toArray();
      setAchievements(data);
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
    }
  }

  async function loadStats() {
    try {
      const totalBooks = await db.books.count();
      const completedBooks = await db.books.where('completed').equals(true).count();
      const favorites = await db.books.where('favorite').equals(true).count();
      const unlockedAchievements = await db.achievements.where('unlocked').equals(true).count();

      setStats({
        totalBooks,
        completedBooks,
        favorites,
        unlockedAchievements,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }

  const getAchievementIcon = (icon) => {
    switch (icon) {
      case 'star':
        return <Star size={32} />;
      case 'book':
        return <BookOpen size={32} />;
      case 'heart':
        return <Heart size={32} />;
      case 'library':
        return <Library size={32} />;
      default:
        return <Trophy size={32} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-24 animate-in fade-in">
      <header className="text-center mb-10">
        <div className="inline-block p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-3xl mb-4">
          <Trophy size={48} className="text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Conquistas</h1>
        <p className="text-gray-400">Desbloqueie conquistas enquanto lê</p>
      </header>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1a1d23] border border-white/5 p-4 rounded-2xl text-center">
          <div className="text-3xl font-bold text-blue-500">{stats.totalBooks}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Livros</div>
        </div>
        
        <div className="bg-[#1a1d23] border border-white/5 p-4 rounded-2xl text-center">
          <div className="text-3xl font-bold text-green-500">{stats.completedBooks}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Concluídos</div>
        </div>
        
        <div className="bg-[#1a1d23] border border-white/5 p-4 rounded-2xl text-center">
          <div className="text-3xl font-bold text-red-500">{stats.favorites}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Favoritos</div>
        </div>
        
        <div className="bg-[#1a1d23] border border-white/5 p-4 rounded-2xl text-center">
          <div className="text-3xl font-bold text-yellow-500">{unlockedCount}/{totalCount}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Conquistas</div>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="bg-[#1a1d23] border border-white/5 p-6 rounded-2xl mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold">Progresso Geral</span>
          <span className="text-sm text-gray-400">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Lista de Conquistas */}
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-[#1a1d23] border p-6 rounded-2xl transition-all ${
              achievement.unlocked
                ? 'border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                : 'border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-4 rounded-2xl ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-500'
                    : 'bg-gray-800 text-gray-600'
                }`}
              >
                {achievement.unlocked ? getAchievementIcon(achievement.icon) : <Lock size={32} />}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>

                {achievement.unlocked ? (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 uppercase tracking-wider">
                    🔒 Bloqueada
                  </div>
                )}
              </div>

              {achievement.unlocked && (
                <div className="text-4xl">
                  {achievement.rarity === 'rare' ? '💎' : achievement.rarity === 'epic' ? '👑' : '🏆'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}