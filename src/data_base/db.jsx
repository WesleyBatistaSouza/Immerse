import Dexie from "dexie";

export const db = new Dexie("ImmerseDB");

db.version(1).stores({
  books: "++id, title, author, category, cover, file, favorite, progress, completed, lastRead, currentPage, totalPages",
  achievements: "id, title, unlocked, unlockedAt"
});

// Inicializar conquistas na primeira vez
db.on('ready', async () => {
  const count = await db.achievements.count();
  
  if (count === 0) {
    await db.achievements.bulkAdd([
      {
        id: 'first_import',
        title: 'Primeiro Passo',
        description: 'Importe seu primeiro livro',
        icon: 'star',
        rarity: 'common',
        unlocked: false,
        unlockedAt: null
      },
      {
        id: 'first_favorite',
        title: 'Amor à Primeira Vista',
        description: 'Favorite um livro pela primeira vez',
        icon: 'heart',
        rarity: 'common',
        unlocked: false,
        unlockedAt: null
      },
      {
        id: 'book_collector',
        title: 'Colecionador',
        description: 'Tenha 5 livros na biblioteca',
        icon: 'library',
        rarity: 'common',
        unlocked: false,
        unlockedAt: null
      },
      {
        id: 'library_master',
        title: 'Mestre Bibliotecário',
        description: 'Tenha 10 livros na biblioteca',
        icon: 'library',
        rarity: 'rare',
        unlocked: false,
        unlockedAt: null
      },
      {
        id: 'first_finish',
        title: 'Missão Cumprida',
        description: 'Conclua sua primeira leitura',
        icon: 'book',
        rarity: 'common',
        unlocked: false,
        unlockedAt: null
      },
      {
        id: 'bookworm',
        title: 'Rato de Biblioteca',
        description: 'Conclua 5 livros',
        icon: 'book',
        rarity: 'rare',
        unlocked: false,
        unlockedAt: null
      },
      {
        id: 'reading_master',
        title: 'Mestre da Leitura',
        description: 'Conclua 10 livros',
        icon: 'book',
        rarity: 'epic',
        unlocked: false,
        unlockedAt: null
      },
    ]);
  }
});